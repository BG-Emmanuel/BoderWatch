package cm.borderwatch.ingestion.domain;
/** Outbound port — events. RabbitMQ adapter implements this. */
public interface TelemetryEventPublisher { void publish(TelemetryRecord r); }
