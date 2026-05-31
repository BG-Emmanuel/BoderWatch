# 🛰 BorderWatch
**High-Availability GPS Goods-in-Transit Surveillance System**  
CEMAC Customs Corridors: Douala–N'Djamena · Douala–Bangui

## Team
| Name | Matricule | Role |
|------|-----------|------|
| Nguend Arthur Johann | ICTU20223180 | Full-Stack Developer · Documentation Lead |
| Tambi Emmanuel Tambi | ICTU20233726 | Team Lead · Scrum Master · Product Owner |

**Course:** SEN3244 — Software Architecture | **GitHub:** https://github.com/BG-Emmanuel/BorderWatch

## Quick Start
```bash
cp .env.example .env      # edit values
./scripts/start.sh        # builds + starts all 13 containers
open http://localhost:80  # React SPA
```

## Login Credentials
| User | Password | Role |
|------|----------|------|
| admin | Admin@2024 | System Admin |
| director | Director@2024 | Customs Director |
| officer1 | Officer@2024 | Customs Officer |
| ops | Ops@2024 | DevOps Engineer |
| auditor | Ops@2024 | Court Auditor |

## Tech Stack
- **Backend:** Spring Boot 3.3 / Java 21 · Hexagonal Architecture
- **Frontend:** React 18 / TypeScript · Zustand · React-Leaflet · Recharts
- **Broker:** RabbitMQ 3.13 AMQP
- **Database:** MySQL 8 (dev) / TiDB Cloud (prod)
- **Infra:** Docker Compose · Nginx · Prometheus · Grafana

## Key Metrics
✅ 10,124 req/sec · P95 137ms · MTTR <18s · 94.9% coverage · ~8,500 FCFA/month
