package cm.borderwatch.compliance.adapter.out.db;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.time.Instant;
import java.util.*;

@Repository @RequiredArgsConstructor
public class ViolationRepository {
    private static final Logger log = LoggerFactory.getLogger(ViolationRepository.class);
    private final JdbcTemplate jdbc;

    public List<Map<String,Object>> findAll(String severity,String status,String corridor,int limit,int offset){
        StringBuilder sql=new StringBuilder("SELECT id,telemetry_id,truck_id,latitude,longitude,deviation_km,corridor_id,severity,penalty_fcfa,detected_at,status,acknowledged_by FROM compliance_violations WHERE 1=1");
        List<Object> p=new ArrayList<>();
        if(severity!=null&&!severity.isBlank()){sql.append(" AND severity=?");p.add(severity.toUpperCase());}
        if(status!=null&&!status.isBlank())  {sql.append(" AND status=?");  p.add(status.toUpperCase());}
        if(corridor!=null&&!corridor.isBlank()){sql.append(" AND corridor_id=?");p.add(corridor);}
        sql.append(" ORDER BY detected_at DESC LIMIT ? OFFSET ?"); p.add(limit); p.add(offset);
        try { return jdbc.queryForList(sql.toString(),p.toArray()); }
        catch(Exception e){ log.error("DB query error: {}",e.getMessage()); return List.of(); }
    }

    public void save(String id,String telId,String truck,double lat,double lon,double km,String severity,int penalty,Instant ts){
        try { jdbc.update("INSERT INTO compliance_violations(id,telemetry_id,truck_id,latitude,longitude,deviation_km,severity,penalty_fcfa,detected_at,status) VALUES(?,?,?,?,?,?,?,?,?,?)",
            id,telId,truck,lat,lon,km,severity,penalty,ts,"PENDING"); }
        catch(Exception e){ log.error("Save violation failed: {}",e.getMessage()); }
    }

    public int updateStatus(String id,String status,String officerId){
        return jdbc.update("UPDATE compliance_violations SET status=?,acknowledged_by=?,acknowledged_at=NOW() WHERE id=?",status,officerId,id);
    }

    public Map<String,Object> getStats(){
        try { return jdbc.queryForMap("SELECT COUNT(*) AS total, COALESCE(SUM(penalty_fcfa),0) AS total_fcfa, SUM(CASE WHEN severity='HIGH' THEN 1 ELSE 0 END) AS high_count, SUM(CASE WHEN severity='MEDIUM' THEN 1 ELSE 0 END) AS medium_count, SUM(CASE WHEN severity='LOW' THEN 1 ELSE 0 END) AS low_count, SUM(CASE WHEN status='PENDING' THEN 1 ELSE 0 END) AS pending_count FROM compliance_violations"); }
        catch(Exception e){ log.error("Stats error: {}",e.getMessage()); return Map.of("total",0,"total_fcfa",0); }
    }
}
