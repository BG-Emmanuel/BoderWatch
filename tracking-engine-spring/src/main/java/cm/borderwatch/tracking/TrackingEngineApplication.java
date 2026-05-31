package cm.borderwatch.tracking;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
@SpringBootApplication @EnableAsync
public class TrackingEngineApplication {
    public static void main(String[] args) { SpringApplication.run(TrackingEngineApplication.class, args); }
}
