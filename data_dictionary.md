# Data Dictionary and Methodology

This artifact uses synthetic partner integration telemetry because customer-level feed, conversion, and payout data is private. The generator is deterministic and can be rerun with `npm run generate`.

## Generated files

| File | Purpose |
|---|---|
| `data/integration_reliability_events.csv` | Daily feed-level observations across 10 synthetic integrations and 35 days |
| `data/reliability_incidents.csv` | Severity-ranked incident rows derived from the full event dataset |
| `src/data.js` | Front-end summary object generated from the same source rows |
| `sql/reliability_investigation_queries.sql` | Interview-ready SQL questions for anomaly review and incident prioritization |

## Fields

| Field | Meaning |
|---|---|
| `date` | Daily observation date |
| `feed_id` | Stable synthetic feed key |
| `feed_name` | Synthetic partner or customer integration feed |
| `integration_type` | API, webhook, CSV, FTP, server postback, or pixel |
| `vertical` | Modeled advertiser vertical |
| `owner` | Operational team most likely to own the integration surface |
| `event_count` | Observed conversion or click event volume |
| `expected_events` | Baseline expected volume after weekly pattern adjustment |
| `minutes_late` | Feed delivery lag in minutes |
| `sla_minutes` | Expected feed arrival SLA for the integration type |
| `duplicate_rate` | Share of events suspected to be replayed or duplicated |
| `baseline_duplicate_rate` | Expected duplicate rate for that feed |
| `schema_drift_fields` | Count of missing, renamed, unexpected, or type-shifted fields |
| `malformed_payload_rate` | Share of records failing payload validation |
| `payout_variance_usd` | Difference between tracked commission and expected payout |
| `data_gap_rate` | Shortfall between observed and expected event volume |
| `impacted_customers` | Modeled affected accounts or partners |
| `source_error_score` | Evidence weight for upstream source-data problems |
| `integration_error_score` | Evidence weight for platform integration-logic problems |
| `severity_score` | Weighted reliability-risk score from 0 to 100 |
| `severity_band` | Low, Medium, or High |
| `issue_type` | Human-readable issue classification |
| `likely_owner` | Source data, Integration logic, or Edge case or shared ownership |
| `anomaly_reason` | Short explanation of triggered anomaly signals |
| `status` | Healthy, Watch, or Open |

## Synthetic generation assumptions

The data models common partner marketing integration structures:

- API and server postback feeds use shorter freshness SLAs.
- CSV and FTP feeds use longer batch arrival windows.
- Each feed has a baseline event volume, duplicate rate, SLA, and partner count.
- Daily volume follows a small weekly pattern plus random noise.
- Injected incident scenarios include schema drift, retry replay, payout reconciliation variance, stale webhooks, and late batch delivery.
- Severity combines freshness delay, duplicate-rate lift, schema drift, malformed payload rate, payout variance, and event-count gaps.
- Likely ownership is inferred from source and integration evidence scores.

The generated data is intentionally realistic enough for portfolio discussion, but it does not represent any real platform, customer, partner, or financial performance.
