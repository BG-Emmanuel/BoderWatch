package cm.borderwatch.ingestion.adapter.in.web;
import cm.borderwatch.ingestion.domain.TelemetryRecord;
import cm.borderwatch.ingestion.domain.TelemetryService;
import io.micrometer.core.instrument.MeterRegistry;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.*;

@RestController @RequestMapping("/api/v1/telemetry") @RequiredArgsConstructor @Slf4j
public class TelemetryController {
    private final TelemetryService service;
    private final MeterRegistry    meterRegistry;

    @Data public static class TelemetryRequest {
        @NotBlank @Size(max=20) private String truck_id;
        @NotNull @DecimalMin("-90") @DecimalMax("90")   private Double latitude;
        @NotNull @DecimalMin("-180") @DecimalMax("180") private Double longitude;
        @DecimalMin("0") @DecimalMax("300")             private Double speed_kmh;
        @DecimalMin("0") @DecimalMax("360")             private Double heading;
        private Instant timestamp;
    }
    public record TelemetryResponse(boolean accepted, UUID id) {}
    public record BatchResponse(int accepted, int rejected, List<UUID> ids) {}

    @PostMapping
    public ResponseEntity<TelemetryResponse> submit(@Valid @RequestBody TelemetryRequest req) {
        TelemetryRecord r = service.ingest(req.getTruck_id(),req.getLatitude(),req.getLongitude(),req.getSpeed_kmh(),req.getHeading(),req.getTimestamp());
        meterRegistry.counter("ingestion.telemetry.total","svc",System.getenv().getOrDefault("SERVICE_ID","unknown")).increment();
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(new TelemetryResponse(true,r.id()));
    }

    @PostMapping("/batch")
    public ResponseEntity<BatchResponse> batch(@RequestBody List<TelemetryRequest> reqs) {
        if (reqs==null||reqs.isEmpty()) return ResponseEntity.status(202).body(new BatchResponse(0,0,List.of()));
        List<UUID> ids=new ArrayList<>(); int rej=0;
        for (TelemetryRequest req : reqs) {
            try { ids.add(service.ingest(req.getTruck_id(),req.getLatitude(),req.getLongitude(),req.getSpeed_kmh(),req.getHeading(),req.getTimestamp()).id()); }
            catch(Exception e){ rej++; }
        }
        return ResponseEntity.status(202).body(new BatchResponse(ids.size(),rej,ids));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String,String>> health() {
        return ResponseEntity.ok(Map.of("status","ok","service",System.getenv().getOrDefault("SERVICE_ID","ingestion-unknown")));
    }

    @ExceptionHandler(org.springframework.web.bind.MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleVal(org.springframework.web.bind.MethodArgumentNotValidException ex) {
        String msg=ex.getBindingResult().getFieldErrors().stream().map(e->e.getField()+": "+e.getDefaultMessage()).findFirst().orElse("Validation failed");
        return ResponseEntity.badRequest().body(Map.of("error",msg,"statusCode",400,"timestamp",Instant.now().toString()));
    }
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String,Object>> handleArg(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error",ex.getMessage(),"statusCode",400,"timestamp",Instant.now().toString()));
    }
}
