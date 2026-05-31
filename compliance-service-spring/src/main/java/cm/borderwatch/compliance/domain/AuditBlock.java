package cm.borderwatch.compliance.domain;

import java.time.Instant;

public record AuditBlock(int index, String violationId, String violationHash, String previousHash, String blockHash, Instant timestamp) {}