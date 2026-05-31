FROM maven:3.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build
COPY compliance-service-spring/pom.xml .
RUN mvn dependency:go-offline -q
COPY compliance-service-spring/src ./src
RUN mvn clean package -DskipTests -q
FROM eclipse-temurin:21-jre-alpine AS runner
RUN addgroup -S bw && adduser -S -G bw -u 1001 bw
WORKDIR /app
COPY --from=builder --chown=bw:bw /build/target/*.jar app.jar
ENV PORT=8083 JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
EXPOSE 8083
HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=3 CMD wget --spider -q http://localhost:8083/actuator/health || exit 1
USER bw
ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]
