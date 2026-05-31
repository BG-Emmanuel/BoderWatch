package cm.borderwatch.ingestion;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
/** BorderWatch — Ingestion Service (Spring Boot 3.3 / Java 21) */
@SpringBootApplication @EnableAsync
public class IngestionServiceApplication {
    public static void main(String[] args) { SpringApplication.run(IngestionServiceApplication.class, args); }
}
