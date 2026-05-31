package cm.borderwatch.compliance.adapter.in.messaging;
import cm.borderwatch.compliance.adapter.out.db.ViolationRepository;
import cm.borderwatch.compliance.domain.ComplianceService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.*;

@Component @RequiredArgsConstructor
public class ViolationEventConsumer {
    private static final Logger log = LoggerFactory.getLogger(ViolationEventConsumer.class);
    private final ComplianceService   svc;
    private final ViolationRepository repo;
    private final ObjectMapper        om;
    private final MeterRegistry       meterRegistry;

    @RabbitListener(queues="compliance.queue", concurrency="3-5")
    public void onViolation(String msg){
        try {
            JsonNode p=om.readTree(msg);
            double km=p.get("deviation_km").asDouble();
            String truck=p.get("truck_id").asText(), telId=p.get("telemetry_id").asText();
            var result=svc.classifyViolation(km);
            String id=UUID.randomUUID().toString();
            Map<String,Object> data=Map.of("telemetry_id",telId,"truck_id",truck,
                "latitude",p.get("latitude").asDouble(),"longitude",p.get("longitude").asDouble(),
                "deviation_km",km,"severity",result.severity().name(),"penalty_fcfa",result.penaltyFcfa());
            svc.createAuditBlock(id,data);
            repo.save(id,telId,truck,p.get("latitude").asDouble(),p.get("longitude").asDouble(),km,
                result.severity().name(),(int)result.penaltyFcfa(),Instant.now());
            meterRegistry.counter("compliance.violations.total","severity",result.severity().name()).increment();
            log.info("Violation recorded: truck={} severity={} penalty={}",truck,result.severity(),result.penaltyFcfa());
        } catch(Exception e){ log.error("Error processing violation: {}",e.getMessage()); }
    }
}
