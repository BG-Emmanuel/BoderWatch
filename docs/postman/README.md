# BorderWatch Postman API Tests

This folder contains the Postman test suite for the BorderWatch API.

## Files

- `BorderWatch.postman_collection.json` - request collection with automated tests.
- `BorderWatch.local.postman_environment.json` - local Docker/VPS environment variables.

## What The Tests Cover

- Gateway health check.
- Admin login and JWT capture.
- Authenticated profile lookup.
- Invalid login rejection.
- Truck listing, lookup, creation, and deactivation.
- Telemetry single and batch ingestion.
- Telemetry validation failure.
- Tracking corridor listing and geofence analysis.
- Compliance violations, stats, audit chain, and chain verification.
- Role-based access control: officer blocked from admin user list, admin allowed.

## Run In Postman Desktop

1. Start BorderWatch locally or on the VPS.
2. Import `BorderWatch.postman_collection.json`.
3. Import `BorderWatch.local.postman_environment.json`.
4. Select the `BorderWatch Local` environment.
5. Set `baseUrl`:
   - Local Docker Compose: `http://localhost:8088`
   - VPS/domain: `http://YOUR_VPS_IP` or `https://your-domain.com`
6. Run the full collection from the Postman Collection Runner.

## Run With Newman

Install Newman if needed:

```bash
npm install -g newman
```

Run the collection:

```bash
newman run docs/postman/BorderWatch.postman_collection.json \
  -e docs/postman/BorderWatch.local.postman_environment.json
```

Generate an HTML report if the reporter is installed:

```bash
npm install -g newman-reporter-htmlextra
newman run docs/postman/BorderWatch.postman_collection.json \
  -e docs/postman/BorderWatch.local.postman_environment.json \
  -r cli,htmlextra \
  --reporter-htmlextra-export docs/postman/borderwatch-postman-report.html
```

## Evidence For Report

For the final project report, include screenshots of:

- Collection imported in Postman.
- Successful collection runner summary.
- Login request showing token generation.
- Telemetry request returning `202 Accepted`.
- Access-control request where officer receives `403 Forbidden`.
- Newman CLI output or HTML report, if used.