package cm.borderwatch.ingestion.adapter.out.messaging;
import cm.borderwatch.ingestion.domain.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component @RequiredArgsConstructor @Slf4j
public class RabbitMqTelemetryPublisher implements TelemetryEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper   objectMapper;
    @Override @Async("telemetryAsyncExecutor")
    public void publish(TelemetryRecord r) {
        try { rabbitTemplate.convertAndSend("telemetry.events","telemetry.received",objectMapper.writeValueAsString(r)); }
        catch(Exception e){ log.warn("MQ publish failed: {}",e.getMessage()); }
    }
}
