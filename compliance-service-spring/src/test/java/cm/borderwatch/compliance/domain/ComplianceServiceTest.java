package cm.borderwatch.compliance.domain;
import org.junit.jupiter.api.*;
import java.util.Map;
import static org.assertj.core.api.Assertions.*;

@DisplayName("ComplianceService Tests")
class ComplianceServiceTest {
    ComplianceService svc;
    @BeforeEach void up(){ svc=new ComplianceService(); }

    @Test void tc201_0kmLow50k(){ var r=svc.classifyViolation(0); assertThat(r.severity()).isEqualTo(Severity.LOW); assertThat(r.penaltyFcfa()).isEqualTo(50_000L); }
    @Test void tc202_10kmLow(){ assertThat(svc.classifyViolation(10).severity()).isEqualTo(Severity.LOW); }
    @Test void tc203_25kmLow(){ assertThat(svc.classifyViolation(25).severity()).isEqualTo(Severity.LOW); }
    @Test void tc204_25_1kmMedium200k(){ var r=svc.classifyViolation(25.1); assertThat(r.severity()).isEqualTo(Severity.MEDIUM); assertThat(r.penaltyFcfa()).isEqualTo(200_000L); }
    @Test void tc205_100kmMedium(){ assertThat(svc.classifyViolation(100).severity()).isEqualTo(Severity.MEDIUM); }
    @Test void tc206_100_1kmHigh1M(){ var r=svc.classifyViolation(100.1); assertThat(r.severity()).isEqualTo(Severity.HIGH); assertThat(r.penaltyFcfa()).isEqualTo(1_000_000L); }
    @Test void tc207_500kmHigh(){ assertThat(svc.classifyViolation(500).severity()).isEqualTo(Severity.HIGH); }
    @Test void tc208_negativeThrows(){ assertThatThrownBy(()->svc.classifyViolation(-1)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc209_nullFromThrows(){ assertThatThrownBy(()->svc.isValidTransition(null,ViolationStatus.ACKNOWLEDGED)).isInstanceOf(IllegalArgumentException.class); }
    @Test void tc211_pendingToAckValid(){ assertThat(svc.isValidTransition(ViolationStatus.PENDING,ViolationStatus.ACKNOWLEDGED)).isTrue(); }
    @Test void tc212_pendingToContestedValid(){ assertThat(svc.isValidTransition(ViolationStatus.PENDING,ViolationStatus.CONTESTED)).isTrue(); }
    @Test void tc213_pendingToResolvedInvalid(){ assertThat(svc.isValidTransition(ViolationStatus.PENDING,ViolationStatus.RESOLVED)).isFalse(); }
    @Test void tc214_ackToResolvedValid(){ assertThat(svc.isValidTransition(ViolationStatus.ACKNOWLEDGED,ViolationStatus.RESOLVED)).isTrue(); }
    @Test void tc215_ackToContestedValid(){ assertThat(svc.isValidTransition(ViolationStatus.ACKNOWLEDGED,ViolationStatus.CONTESTED)).isTrue(); }
    @Test void tc216_ackToPendingInvalid(){ assertThat(svc.isValidTransition(ViolationStatus.ACKNOWLEDGED,ViolationStatus.PENDING)).isFalse(); }
    @Test void tc219_resolvedTerminal(){ for(ViolationStatus to:ViolationStatus.values()) assertThat(svc.isValidTransition(ViolationStatus.RESOLVED,to)).isFalse(); }
    @Test void tc221_validTransitionReturnsEntry(){ var e=svc.buildAuditEntry("V1",ViolationStatus.PENDING,ViolationStatus.ACKNOWLEDGED,"OFF-007"); assertThat(e.officerId()).isEqualTo("OFF-007"); }
    @Test void tc222_invalidTransitionThrows(){ assertThatThrownBy(()->svc.buildAuditEntry("V1",ViolationStatus.RESOLVED,ViolationStatus.PENDING,"O1")).isInstanceOf(IllegalArgumentException.class).hasMessageContaining("Invalid transition"); }
    @Test void tc224_genesisBlockPrevZero(){ var b=svc.createAuditBlock("V1",Map.of("k","v")); assertThat(b.previousHash()).isEqualTo("0".repeat(64)); assertThat(b.index()).isEqualTo(0); }
    @Test void tc225_blockHashSha256(){ var b=svc.createAuditBlock("V1",Map.of("k","v")); assertThat(b.blockHash()).matches("[a-f0-9]{64}"); }
    @Test void tc226_secondBlockLinksFirst(){ var b0=svc.createAuditBlock("V1",Map.of("k","v1")); var b1=svc.createAuditBlock("V2",Map.of("k","v2")); assertThat(b1.previousHash()).isEqualTo(b0.blockHash()); }
    @Test void tc227_emptyChainVerifies(){ assertThat((Boolean)svc.verifyChain().get("valid")).isTrue(); }
    @Test void tc228_singleBlockVerifies(){ svc.createAuditBlock("V1",Map.of("k","v")); assertThat((Boolean)svc.verifyChain().get("valid")).isTrue(); }
    @Test void tc229_threeBlocksVerify(){ svc.createAuditBlock("V1",Map.of("k","v1")); svc.createAuditBlock("V2",Map.of("k","v2")); svc.createAuditBlock("V3",Map.of("k","v3")); assertThat((Boolean)svc.verifyChain().get("valid")).isTrue(); }
    @Test void tc230_merkleNullForEmpty(){ assertThat(svc.buildMerkleRoot()).isNull(); }
    @Test void tc231_merkleHash(){ svc.createAuditBlock("V1",Map.of("k","v")); assertThat(svc.buildMerkleRoot()).matches("[a-f0-9]{64}"); }
    @Test void tc232_differentDataDiffHash(){ var b1=svc.createAuditBlock("V1",Map.of("k","v1")); var s2=new ComplianceService(); var b2=s2.createAuditBlock("V2",Map.of("k","v2")); assertThat(b1.violationHash()).isNotEqualTo(b2.violationHash()); }
    @Test void tc233_chainImmutable(){ svc.createAuditBlock("V1",Map.of("k","v")); assertThatThrownBy(()->svc.getChain().add(null)).isInstanceOf(UnsupportedOperationException.class); }
    @Test void tc234_blockIndexIncrements(){ svc.createAuditBlock("V1",Map.of("k","v")); var b=svc.createAuditBlock("V2",Map.of("k","v")); assertThat(b.index()).isEqualTo(1); }
    @Test void tc235_blockTimestampNotNull(){ assertThat(svc.createAuditBlock("V1",Map.of("k","v")).timestamp()).isNotNull(); }
    @Test void tc236_auditEntryHasTimestamp(){ var e=svc.buildAuditEntry("V1",ViolationStatus.PENDING,ViolationStatus.ACKNOWLEDGED,"O1"); assertThat(e.transitionedAt()).isNotNull(); }
}
