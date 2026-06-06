# BorderWatch Architecture Documentation

## 1. Architecture Overview

BorderWatch uses a microservices architecture combined with hexagonal architecture within each backend service. The system is designed for high availability, scalability, observability, and separation of concerns.

The application monitors GPS-based goods-in-transit movement across customs corridors and detects compliance violations using telemetry, tracking, and compliance services.

## 2. Chosen Architecture Style

### Microservices Architecture

The system is divided into independently deployable services:

- Ingestion Service
- Tracking Engine
- Compliance Service
- Gateway Service
- Frontend React Application
- MySQL Database
- RabbitMQ Message Broker
- Prometheus and Grafana Monitoring

### Hexagonal Architecture

Each Spring Boot service follows a hexagonal architecture pattern where domain logic is separated from external adapters such as REST controllers, messaging consumers, database adapters, and configuration classes.

## 3. Reason For Choosing The Architecture

Microservices were chosen because BorderWatch has multiple independent responsibilities: telemetry ingestion, GPS tracking, compliance classification, user interaction, and monitoring. Separating these responsibilities improves maintainability, scalability, fault isolation, and deployment flexibility.

RabbitMQ enables asynchronous communication between services, reducing tight coupling and improving resilience.

## 4. Main Components

| Component | Responsibility |
|---|---|
| React Frontend | Provides user interface for officers, administrators, auditors, and DevOps users |
| Nginx Gateway | Serves frontend and routes API requests to backend services |
| Ingestion Service | Receives telemetry, manages users, trucks, and authentication |
| Tracking Engine | Processes GPS positions and corridor/geofence logic |
| Compliance Service | Classifies violations, manages penalties, and maintains audit chain |
| MySQL | Stores users, trucks, telemetry, violations, and system data |
| RabbitMQ | Provides asynchronous messaging between services |
| Prometheus | Collects infrastructure and service metrics |
| Grafana | Visualizes metrics through dashboards |
| Jenkins | Automates testing, building, and deployment |
| Kubernetes | Orchestrates service deployment, scaling, and discovery |

## 5. Component View

```mermaid
flowchart LR
    User[User Browser] --> Frontend[React Frontend]
    Frontend --> Gateway[Nginx Gateway]
    Gateway --> Ingestion[Ingestion Service]
    Gateway --> Tracking[Tracking Engine]
    Gateway --> Compliance[Compliance Service]

    Ingestion --> MySQL[(MySQL Database)]
    Tracking --> MySQL
    Compliance --> MySQL

    Ingestion --> RabbitMQ[(RabbitMQ Broker)]
    RabbitMQ --> Tracking
    RabbitMQ --> Compliance

    Prometheus[Prometheus] --> Ingestion
    Prometheus --> Tracking
    Prometheus --> Compliance
    Prometheus --> NodeExporter[Node Exporter]
    Grafana[Grafana] --> Prometheus
