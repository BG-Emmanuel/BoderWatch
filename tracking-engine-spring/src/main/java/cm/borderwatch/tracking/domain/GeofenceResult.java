package cm.borderwatch.tracking.domain;

public record GeofenceResult(String status, String corridorId, double minDistanceKm) {}