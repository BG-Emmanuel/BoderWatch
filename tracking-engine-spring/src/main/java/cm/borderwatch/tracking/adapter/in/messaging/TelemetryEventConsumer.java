package cm.borderwatch.tracking.adapter.in.messaging;
import cm.borderwatch.tracking.domain.GeofencingService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.micrometer.core.instrument.MeterRegistry;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor @Slf4j
public class TelemetryEventConsumer {
    private final GeofencingService svc;
    private final RabbitTemplate    rabbitTemplate;
    private final ObjectMapper      objectMapper;
    private final MeterRegistry     meterRegistry;

    @RabbitListener(queues="tracking.queue", concurrency="3-10")
    public void onEvent(String msg) {
        try {
            JsonNode p=objectMapper.readTree(msg);
            double lat=p.get("latitude").asDouble(),lon=p.get("longitude").asDouble();
            var r=svc.analyzePosition(lat,lon);
            meterRegistry.counter("tracking.geofence.total","result",r.status()).increment();
            if("OFF_ROUTE".equals(r.status())){
                String viol=objectMapper.createObjectNode()
                    .put("telemetry_id",p.get("id").asText()).put("truck_id",p.get("truckId").asText())
                    .put("latitude",lat).put("longitude",lon)
                    .put("deviation_km",r.minDistanceKm())
                    .put("severity",svc.classifyViolationSeverity(r.minDistanceKm())).toString();
                rabbitTemplate.convertAndSend("telemetry.events","compliance.violation",viol);
                log.info("OFF_ROUTE: truck={} deviation={}km",p.get("truckId").asText(),r.minDistanceKm());
            }
        } catch(Exception e){ log.error("Error: {}",e.getMessage()); }
    }
}
