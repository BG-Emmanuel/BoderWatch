package cm.borderwatch.ingestion.adapter.out.db;
import cm.borderwatch.ingestion.domain.TelemetryRecord;
import cm.borderwatch.ingestion.domain.TelemetryRepository;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.*;
import java.time.Instant;
import java.util.UUID;

@Entity @Table(name="truck_telemetry") @Getter @Setter @NoArgsConstructor
class TelemetryEntity {
    @Id @Column(name="id") private UUID id;
    @Column(name="truck_id",length=20,nullable=false) private String truckId;
    @Column(name="latitude",nullable=false) private Double latitude;
    @Column(name="longitude",nullable=false) private Double longitude;
    @Column(name="speed_kmh") private Double speedKmh;
    @Column(name="heading")   private Double heading;
    @Column(name="timestamp",nullable=false) private Instant timestamp;
    @Column(name="status",nullable=false)    private String status;
    @Column(name="created_at",nullable=false,updatable=false) private Instant createdAt=Instant.now();

    static TelemetryEntity from(TelemetryRecord r) {
        TelemetryEntity e=new TelemetryEntity();
        e.id=r.id();e.truckId=r.truckId();e.latitude=r.latitude();e.longitude=r.longitude();
        e.speedKmh=r.speedKmh();e.heading=r.heading();e.timestamp=r.timestamp();e.status=r.status();
        return e;
    }
}

@Repository interface TelemetryJpaRepo extends JpaRepository<TelemetryEntity,UUID> {}

@Component @RequiredArgsConstructor
public class TelemetryJpaAdapter implements TelemetryRepository {
    private final TelemetryJpaRepo jpa;
    @Override @Async("telemetryAsyncExecutor")
    public void save(TelemetryRecord r) {
        try { jpa.save(TelemetryEntity.from(r)); }
        catch(Exception e){ org.slf4j.LoggerFactory.getLogger(TelemetryJpaAdapter.class).warn("DB write failed: {}",e.getMessage()); }
    }
}
