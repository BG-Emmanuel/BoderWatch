#!/bin/bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Running BorderWatch tests..."
for SVC in ingestion-service-spring tracking-engine-spring compliance-service-spring; do
  echo "--- $SVC ---"
  cd "$ROOT/$SVC"
  mvn test -q
  echo "✅ $SVC tests passed"
  cd "$ROOT"
done
echo "All 116+ tests passed!"
