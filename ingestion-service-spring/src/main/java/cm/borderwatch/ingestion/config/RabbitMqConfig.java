package cm.borderwatch.ingestion.config;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.*;

@Configuration
public class RabbitMqConfig {
    @Bean public TopicExchange telemetryEventsExchange() { return ExchangeBuilder.topicExchange("telemetry.events").durable(true).build(); }
    @Bean public Queue trackingQueue()   { return QueueBuilder.durable("tracking.queue").build(); }
    @Bean public Queue complianceQueue() { return QueueBuilder.durable("compliance.queue").build(); }
    @Bean public Binding trackingBinding(Queue trackingQueue, TopicExchange telemetryEventsExchange) { return BindingBuilder.bind(trackingQueue).to(telemetryEventsExchange).with("telemetry.received"); }
    @Bean public Binding complianceBinding(Queue complianceQueue, TopicExchange telemetryEventsExchange) { return BindingBuilder.bind(complianceQueue).to(telemetryEventsExchange).with("compliance.violation"); }
    @Bean public Jackson2JsonMessageConverter messageConverter() { return new Jackson2JsonMessageConverter(); }
    @Bean public RabbitTemplate rabbitTemplate(ConnectionFactory cf) { RabbitTemplate t=new RabbitTemplate(cf); t.setMessageConverter(messageConverter()); return t; }
}
