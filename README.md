# Partner Data Reliability Monitor

Static reliability-operations dashboard for partnership-marketing integration data. The project is a recruiter-facing proof artifact for a Data Reliability Analyst role: it shows how I would investigate feed issues, diagnose root causes, and translate reliability risk into product and engineering actions.

![Partner Data Reliability Monitor dashboard](docs/images/dashboard.png)

## Why this exists

impact.com-style partnership data flows through APIs, webhooks, CSV files, and tracking pixels. When that data is late, duplicated, malformed, or unreconciled, teams need an investigation view that separates source-data issues from integration logic errors and customer-impact risk.

## What is in the project

- A polished static dashboard in `index.html`
- Modular UI/data files in `src/`
- Synthetic integration reliability data in `synthetic_reliability_data.csv`
- A data dictionary and methodology notes in `data_dictionary.md`
- A screenshot captured from the rendered app in `docs/images/dashboard.png`

## Dashboard sections

- Reliability pulse: monitored feeds, open incidents, duplicate-event rate, and validation coverage
- Incident queue: likely root cause and impact by feed
- Detection coverage: freshness, schema drift, duplicate checks, payout reconciliation, and impact mapping
- Reliability score composition: how each signal affects the operating score
- Product memo: roadmap actions for schema monitoring, duplicate prevention, and incident handoffs

## Run locally

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Resume-ready summary

Built partner-data reliability monitor with synthetic conversion, API, and payout feeds, surfacing schema drift, duplicate events, and anomaly alerts for integration roadmap prioritization and customer-impact triage.
