package cm.borderwatch.tracking.adapter.in.web;
import cm.borderwatch.tracking.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/v1/tracking") @RequiredArgsConstructor
public class TrackingController {
    private final GeofencingService svc;
    @PostMapping("/analyze")
    public ResponseEntity<GeofenceResult> analyze(@RequestBody Map<String,Double> body){
        return ResponseEntity.ok(svc.analyzePosition(body.getOrDefault("latitude",0.0),body.getOrDefault("longitude",0.0)));
    }
    @GetMapping("/corridors")
    public ResponseEntity<?> corridors(){
        return ResponseEntity.ok(GeofencingService.LEGAL_CORRIDORS.stream()
            .map(c->Map.of("id",c.id(),"name",c.name(),"toleranceKm",c.toleranceKm(),"waypointCount",c.waypoints().size())).toList());
    }
    @GetMapping("/health")
    public ResponseEntity<Map<String,String>> health(){ return ResponseEntity.ok(Map.of("status","ok","service",System.getenv().getOrDefault("SERVICE_ID","tracking-unknown"))); }
}
