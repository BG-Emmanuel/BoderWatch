package cm.borderwatch.compliance.domain;

import java.time.Instant;

public record AuditEntry(String violationId, ViolationStatus fromStatus, ViolationStatus toStatus, String officerId, Instant transitionedAt) {}
