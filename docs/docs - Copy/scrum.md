# BorderWatch Scrum Documentation

## Scrum Roles

| Role | Name | Responsibility |
|---|---|---|
| Product Owner | Tambi Emmanuel Tambi | Defines project vision, prioritizes backlog, validates features |
| Scrum Master | Tambi Emmanuel Tambi | Coordinates sprint planning, removes blockers, tracks progress |
| Development Team | Nguend Arthur Johann | Backend, frontend, documentation, testing |
| Development Team | Tambi Emmanuel Tambi | DevOps, deployment, architecture, testing |

## Product Backlog

| ID | User Story | Priority | Status |
|---|---|---|---|
| PB-01 | As a customs officer, I want to log in securely so that I can access the system. | High | Done |
| PB-02 | As a customs officer, I want to view trucks in transit so that I can monitor goods movement. | High | Done |
| PB-03 | As a customs officer, I want to receive telemetry updates so that I can track truck locations. | High | Done |
| PB-04 | As a compliance officer, I want violations classified by severity so that penalties can be applied. | High | Done |
| PB-05 | As an administrator, I want user management so that I can control access. | Medium | Done |
| PB-06 | As a DevOps engineer, I want Docker deployment so that the application can run consistently. | High | Done |
| PB-07 | As a DevOps engineer, I want Kubernetes deployment so that services can scale and recover. | High | Done |
| PB-08 | As a DevOps engineer, I want Jenkins CI/CD so that tests and deployment are automated. | High | Done |
| PB-09 | As a DevOps engineer, I want monitoring dashboards so that service health can be observed. | Medium | Done |
| PB-10 | As a project evaluator, I want documentation so that the system can be understood and reproduced. | High | In Progress |

## Sprint 1 Planning

**Sprint Goal:** Build the core BorderWatch application features.

| Task | Owner | Status |
|---|---|---|
| Set up Spring Boot microservices | Team | Done |
| Create React frontend | Team | Done |
| Configure MySQL database | Team | Done |
| Configure RabbitMQ messaging | Team | Done |
| Implement telemetry ingestion | Team | Done |
| Implement tracking engine | Team | Done |
| Implement compliance service | Team | Done |

## Sprint 1 Burndown

| Day | Remaining Tasks |
|---|---|
| Day 1 | 7 |
| Day 2 | 6 |
| Day 3 | 5 |
| Day 4 | 4 |
| Day 5 | 3 |
| Day 6 | 1 |
| Day 7 | 0 |

## Sprint 1 Retrospective

**What went well:** Core application modules were completed successfully. The team implemented key services and established communication between backend services.

**Challenges:** Integrating service communication and database initialization required extra debugging.

**Improvement:** Start integration testing earlier in the sprint.

## Sprint 2 Planning

**Sprint Goal:** Deploy, test, monitor, and automate BorderWatch.

| Task | Owner | Status |
|---|---|---|
| Configure VPS infrastructure | Team | Done |
| Dockerize services | Team | Done |
| Deploy using Docker Compose | Team | Done |
| Deploy using Kubernetes | Team | Done |
| Configure Jenkins CI/CD | Team | Done |
| Configure Prometheus and Grafana | Team | Done |
| Create Ansible playbooks | Team | Done |
| Generate testing and coverage evidence | Team | In Progress |

## Sprint 2 Burndown

| Day | Remaining Tasks |
|---|---|
| Day 1 | 8 |
| Day 2 | 7 |
| Day 3 | 6 |
| Day 4 | 4 |
| Day 5 | 3 |
| Day 6 | 1 |
| Day 7 | 0 |

## Sprint 2 Retrospective

**What went well:** Docker, Kubernetes, Jenkins, and monitoring were successfully configured. The team resolved CI/CD and testing issues.

**Challenges:** Jenkins required custom configuration to support Maven, Node, Docker, and Docker Compose. Kubernetes image import also required extra setup.

**Improvement:** Prepare deployment tooling earlier and document credentials/configuration more carefully.
