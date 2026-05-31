package cm.borderwatch.ingestion.domain;
/** Outbound port — DB. JPA adapter implements this. */
public interface TelemetryRepository { void save(TelemetryRecord r); }
