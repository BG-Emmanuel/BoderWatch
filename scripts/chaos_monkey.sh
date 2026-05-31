#!/bin/bash
set -euo pipefail
echo "⚡ BorderWatch Chaos Monkey"
for T in borderwatch-ingestion-1-1 borderwatch-tracking-1-1; do
  echo "Killing $T..."
  docker kill "$T" 2>/dev/null || { echo "Container not found — skipping"; continue; }
  START=$(date +%s%3N)
  while true; do
    S=$(docker inspect --format='{{.State.Status}}' "$T" 2>/dev/null || echo missing)
    H=$(docker inspect --format='{{.State.Health.Status}}' "$T" 2>/dev/null || echo none)
    [ "$S" = "running" ] && [ "$H" = "healthy" ] && { echo "✅ $T healed in $(( ($(date +%s%3N)-START)/1000 ))s"; break; }
    sleep 1
    [ $(( ($(date +%s%3N)-START)/1000 )) -gt 60 ] && { echo "❌ Did not heal in 60s"; break; }
  done
  sleep 3
done
