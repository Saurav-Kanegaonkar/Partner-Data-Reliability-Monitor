# Data Dictionary and Methodology

The data is synthetic because customer-level partner integration data is private. It is shaped around partnership-marketing feeds where conversion, payout, and payload reliability determine customer trust.

| Field | Meaning |
|---|---|
| `feed` | Synthetic partner or customer integration feed |
| `integration_type` | API, webhook, CSV, or pixel |
| `event_count` | Daily tracked conversion or click events |
| `duplicate_rate` | Share of events suspected to be replayed or duplicated |
| `schema_drift_count` | Count of unexpected, missing, or renamed payload fields |
| `payout_gap` | Difference between tracked commission and expected payout |
| `severity_score` | Weighted reliability-risk score from 0 to 100 |
| `customer_impact` | Affected advertisers, accounts, or payout exposure |

## Methodology

The monitor ranks incidents by customer impact, severity, and whether the likely root cause is source data, integration logic, or reporting lag. The product memo converts these signals into roadmap-ready actions for Product, Engineering, and Customer Success.
