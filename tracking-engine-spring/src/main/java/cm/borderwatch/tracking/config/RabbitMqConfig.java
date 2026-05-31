package cm.borderwatch.tracking.config;
import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.*;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;
@Configuration @EnableAsync
public class RabbitMqConfig {
    @Bean public TopicExchange exchange(){ return ExchangeBuilder.topicExchange("telemetry.events").durable(true).build(); }
    @Bean public Queue trackingQueue(){ return QueueBuilder.durable("tracking.queue").build(); }
    @Bean public Queue complianceQueue(){ return QueueBuilder.durable("compliance.queue").build(); }
    @Bean public Binding trackingBinding(Queue trackingQueue, TopicExchange exchange){ return BindingBuilder.bind(trackingQueue).to(exchange).with("telemetry.received"); }
    @Bean public Binding complianceBinding(Queue complianceQueue, TopicExchange exchange){ return BindingBuilder.bind(complianceQueue).to(exchange).with("compliance.violation"); }
    @Bean public Jackson2JsonMessageConverter messageConverter(){ return new Jackson2JsonMessageConverter(); }
    @Bean public RabbitTemplate rabbitTemplate(ConnectionFactory cf){ RabbitTemplate t=new RabbitTemplate(cf); t.setMessageConverter(messageConverter()); return t; }
    @Bean(name="asyncExecutor") public Executor asyncExecutor(){ ThreadPoolTaskExecutor e=new ThreadPoolTaskExecutor(); e.setCorePoolSize(10); e.setMaxPoolSize(50); e.setQueueCapacity(5000); e.setThreadNamePrefix("trk-async-"); e.initialize(); return e; }
}
