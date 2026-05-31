#!/bin/bash
set -e
echo "🛰  Starting BorderWatch..."
[ ! -f .env ] && { echo "ERROR: .env not found — run: cp .env.example .env and fill in values"; exit 1; }
docker compose up -d --build
echo "Waiting for services to be healthy..."
sleep 20
docker compose ps
echo ""
echo "✅ BorderWatch is running!"
echo "   Frontend:    http://localhost:80"
echo "   Grafana:     http://localhost:3000  (admin/admin)"
echo "   RabbitMQ:    http://localhost:15672 (borderwatch/<password>)"
echo "   Prometheus:  http://localhost:9090"
echo ""
echo "👤 Login credentials:"
echo "   admin    / Admin@2024      (System Admin)"
echo "   director / Director@2024   (Customs Director)"
echo "   officer1 / Officer@2024    (Customs Officer)"
echo "   ops      / Ops@2024        (DevOps Engineer)"
echo "   auditor  / Ops@2024        (Court Auditor)"
