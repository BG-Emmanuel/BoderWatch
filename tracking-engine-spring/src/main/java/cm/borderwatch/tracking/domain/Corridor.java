package cm.borderwatch.tracking.domain;

import java.util.List;

public record Corridor(String id, String name, double toleranceKm, List<Waypoint> waypoints) {}