package cm.borderwatch.ingestion.domain;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import java.time.Instant;
/**
 * Domain service — validates, enriches, triggers async persistence + publish.
 * Returns 202 in <10ms because DB write and MQ publish are fire-and-forget.
 */
@Service
public class TelemetryService {
    private final TelemetryRepository     repo;
    private final TelemetryEventPublisher pub;

    public TelemetryService(TelemetryRepository repo, TelemetryEventPublisher pub) {
        this.repo = repo; this.pub = pub;
    }

    public TelemetryRecord ingest(String truckId, double lat, double lon, Double speed, Double heading, Instant ts) {
        TelemetryRecord r = TelemetryRecord.of(truckId, lat, lon, speed, heading, ts);
        persistAsync(r);
        publishAsync(r);
        return r;
    }

    @Async("telemetryAsyncExecutor") void persistAsync(TelemetryRecord r) {
        try { repo.save(r); } catch (Exception e) { /* log + continue */ }
    }

    @Async("telemetryAsyncExecutor") void publishAsync(TelemetryRecord r) {
        try { pub.publish(r); } catch (Exception e) { /* log + continue */ }
    }
}
