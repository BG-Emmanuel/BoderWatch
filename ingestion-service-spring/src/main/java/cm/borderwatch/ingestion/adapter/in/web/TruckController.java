package cm.borderwatch.ingestion.adapter.in.web;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/v1/trucks") @RequiredArgsConstructor @Slf4j
public class TruckController {
    private final JdbcTemplate jdbc;

    @Data public static class TruckRequest {
        private String truck_id,plate_number,operator_name,operator_email,operator_phone,cargo_type,notes;
    }

    @GetMapping @PreAuthorize("hasAnyRole('OFFICER','DIRECTOR','ADMIN','OPS','AUDITOR')")
    public ResponseEntity<?> list(@RequestParam(required=false) String cargo_type,
                                   @RequestParam(defaultValue="50") int limit, @RequestParam(defaultValue="0") int offset) {
        String sql="SELECT id,truck_id,plate_number,operator_name,cargo_type,is_active,registered_at FROM trucks WHERE 1=1";
        List<Object> p=new ArrayList<>();
        if(cargo_type!=null){sql+=" AND cargo_type=?";p.add(cargo_type.toUpperCase());}
        sql+=" ORDER BY registered_at DESC LIMIT ? OFFSET ?"; p.add(limit); p.add(offset);
        var trucks=jdbc.queryForList(sql,p.toArray());
        return ResponseEntity.ok(Map.of("trucks",trucks,"count",trucks.size()));
    }

    @GetMapping("/{tid}") @PreAuthorize("hasAnyRole('OFFICER','DIRECTOR','ADMIN','OPS')")
    public ResponseEntity<?> get(@PathVariable String tid) {
        var r=jdbc.queryForList("SELECT * FROM trucks WHERE truck_id=?",tid);
        return r.isEmpty()?ResponseEntity.status(404).body(Map.of("error","Not found")):ResponseEntity.ok(r.get(0));
    }

    @PostMapping @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> register(@RequestBody TruckRequest req) {
        try {
            String id=UUID.randomUUID().toString();
            jdbc.update("INSERT INTO trucks(id,truck_id,plate_number,operator_name,operator_email,operator_phone,cargo_type,notes) VALUES(?,?,?,?,?,?,?,?)",
                id,req.getTruck_id(),req.getPlate_number(),req.getOperator_name(),req.getOperator_email(),req.getOperator_phone(),
                req.getCargo_type()!=null?req.getCargo_type():"GENERAL_GOODS",req.getNotes());
            return ResponseEntity.status(201).body(Map.of("id",id,"truck_id",req.getTruck_id()));
        } catch(Exception e){ return ResponseEntity.status(400).body(Map.of("error",e.getMessage())); }
    }

    @DeleteMapping("/{tid}") @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivate(@PathVariable String tid) {
        jdbc.update("UPDATE trucks SET is_active=FALSE WHERE truck_id=?",tid);
        return ResponseEntity.ok(Map.of("message","Truck deactivated"));
    }

    @GetMapping("/{tid}/history") @PreAuthorize("hasAnyRole('OFFICER','DIRECTOR','ADMIN')")
    public ResponseEntity<?> history(@PathVariable String tid,
                                      @RequestParam(required=false) String from,
                                      @RequestParam(required=false) String to,
                                      @RequestParam(defaultValue="200") int limit) {
        String sql="SELECT latitude,longitude,speed_kmh,heading,timestamp,status,corridor_id,deviation_km FROM truck_telemetry WHERE truck_id=?";
        List<Object> p=new ArrayList<>(); p.add(tid);
        if(from!=null){sql+=" AND timestamp>=?";p.add(from);}
        if(to!=null){sql+=" AND timestamp<=?";p.add(to);}
        sql+=" ORDER BY timestamp DESC LIMIT ?"; p.add(limit);
        var history=jdbc.queryForList(sql,p.toArray());
        return ResponseEntity.ok(Map.of("truckId",tid,"history",history,"count",history.size()));
    }
}
