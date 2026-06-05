@GetMapping("/chain")
public ResponseEntity<?> chain() {
    var blocks = svc.getChain();
    if (blocks == null) {
        blocks = java.util.List.of();
    }

    return ResponseEntity.ok(Map.of(
        "blocks", blocks,
        "merkleRoot", "",
        "totalBlocks", blocks.size()
    ));
}package cm.borderwatch.compliance.adapter.in.web;
import cm.borderwatch.compliance.adapter.out.db.ViolationRepository;
import cm.borderwatch.compliance.domain.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@GetMapping("/chain")
public ResponseEntity<?> chain() {
    var blocks = svc.getChain();
    if (blocks == null) {
        blocks = java.util.List.of();
    }

    var merkleRoot = svc.buildMerkleRoot();
    if (merkleRoot == null) {
        merkleRoot = "";
    }

    return ResponseEntity.ok(Map.of(
        "blocks", blocks,
        "merkleRoot", merkleRoot,
        "totalBlocks", blocks.size()
    ));
}@RestController @RequestMapping("/api/v1/compliance") @RequiredArgsConstructor
public class ComplianceController {
    private final ComplianceService   svc;
    private final ViolationRepository repo;

    @GetMapping("/violations")
    public ResponseEntity<?> violations(@RequestParam(required=false) String severity,
        @RequestParam(required=false) String status, @RequestParam(required=false) String corridor,
        @RequestParam(defaultValue="50") int limit, @RequestParam(defaultValue="0") int offset){
        var list=repo.findAll(severity,status,corridor,limit,offset);
        long total=list.stream().mapToLong(v->v.get("penalty_fcfa")!=null?((Number)v.get("penalty_fcfa")).longValue():0).sum();
        return ResponseEntity.ok(Map.of("violations",list,"count",list.size(),"totalPenaltyFcfa",total));
    }
    @PostMapping("/violations/{id}/acknowledge")
    public ResponseEntity<?> ack(@PathVariable String id, @RequestBody Map<String,String> body){
        try { var e=svc.buildAuditEntry(id,ViolationStatus.PENDING,ViolationStatus.ACKNOWLEDGED,body.getOrDefault("officer_id","UNKNOWN")); repo.updateStatus(id,"ACKNOWLEDGED",e.officerId()); return ResponseEntity.ok(e); }
        catch(IllegalArgumentException e){ return ResponseEntity.badRequest().body(Map.of("error",e.getMessage())); }
    }
    @PostMapping("/violations/{id}/contest")
    public ResponseEntity<?> contest(@PathVariable String id, @RequestBody Map<String,String> body){
        try { var e=svc.buildAuditEntry(id,ViolationStatus.PENDING,ViolationStatus.CONTESTED,body.getOrDefault("officer_id","UNKNOWN")); repo.updateStatus(id,"CONTESTED",e.officerId()); return ResponseEntity.ok(e); }
        catch(IllegalArgumentException e){ return ResponseEntity.badRequest().body(Map.of("error",e.getMessage())); }
    }
    @PostMapping("/violations/{id}/resolve")
    public ResponseEntity<?> resolve(@PathVariable String id, @RequestBody Map<String,String> body){
        try { var e=svc.buildAuditEntry(id,ViolationStatus.ACKNOWLEDGED,ViolationStatus.RESOLVED,body.getOrDefault("officer_id","UNKNOWN")); repo.updateStatus(id,"RESOLVED",e.officerId()); return ResponseEntity.ok(e); }
        catch(IllegalArgumentException e){ return ResponseEntity.badRequest().body(Map.of("error",e.getMessage())); }
    }
    @GetMapping("/stats")
    public ResponseEntity<?> stats(){ return ResponseEntity.ok(repo.getStats()); }
    @GetMapping("/chain")
    public ResponseEntity<?> chain(){ return ResponseEntity.ok(Map.of("blocks",svc.getChain(),"merkleRoot",svc.buildMerkleRoot(),"totalBlocks",svc.getChain().size())); }
    @GetMapping("/chain/verify")
    public ResponseEntity<?> verify(){ return ResponseEntity.ok(svc.verifyChain()); }
    @GetMapping("/health")
    public ResponseEntity<Map<String,String>> health(){ return ResponseEntity.ok(Map.of("status","ok","service",System.getenv().getOrDefault("SERVICE_ID","compliance-unknown"))); }
}
