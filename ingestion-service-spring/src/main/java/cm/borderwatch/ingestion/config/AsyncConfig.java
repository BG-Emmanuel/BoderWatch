package cm.borderwatch.ingestion.config;
import org.springframework.context.annotation.*;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Executor;

/** Fixes OOM crash at 10k rps — bounded thread pool instead of SimpleAsyncTaskExecutor */
@Configuration @EnableAsync
public class AsyncConfig {
    @Bean(name="telemetryAsyncExecutor")
    public Executor telemetryAsyncExecutor() {
        ThreadPoolTaskExecutor ex=new ThreadPoolTaskExecutor();
        ex.setCorePoolSize(20); ex.setMaxPoolSize(100); ex.setQueueCapacity(10000);
        ex.setThreadNamePrefix("bw-async-");
        ex.setRejectedExecutionHandler(new java.util.concurrent.ThreadPoolExecutor.CallerRunsPolicy());
        ex.initialize(); return ex;
    }
}
