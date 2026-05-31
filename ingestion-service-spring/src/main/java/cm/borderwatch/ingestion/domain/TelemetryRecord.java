package cm.borderwatch.ingestion.domain;
import java.time.Instant;
import java.util.UUID;
/**
 * Pure domain record — zero Spring/JPA/AMQP imports.
 * Testable without any framework.
 */
public record TelemetryRecord(UUID id, String truckId, double latitude, double longitude,
                               Double speedKmh, Double heading, Instant timestamp, String status) {
    public static TelemetryRecord of(String truckId, double lat, double lon, Double speed, Double heading, Instant ts) {
        if (truckId==null||truckId.isBlank())         throw new IllegalArgumentException("truck_id is required");
        if (truckId.trim().length()>20)               throw new IllegalArgumentException("truck_id must not exceed 20 characters");
        if (lat<-90||lat>90)                           throw new IllegalArgumentException("latitude must be between -90 and 90");
        if (lon<-180||lon>180)                         throw new IllegalArgumentException("longitude must be between -180 and 180");
        if (speed!=null&&(speed<0||speed>300))         throw new IllegalArgumentException("speed_kmh must be 0-300");
        if (heading!=null&&(heading<0||heading>360))   throw new IllegalArgumentException("heading must be 0-360");
        return new TelemetryRecord(UUID.randomUUID(),truckId.trim(),lat,lon,speed,heading,ts!=null?ts:Instant.now(),"ON_ROUTE");
    }
}
