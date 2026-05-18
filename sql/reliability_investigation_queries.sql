-- Portfolio SQL appendix for a partner integration data reliability review.
-- Table assumed: integration_reliability_events

-- 1. Find feeds where duplicate conversion rates are materially above baseline.
WITH duplicate_lift AS (
  SELECT
    date,
    feed_name,
    integration_type,
    duplicate_rate,
    baseline_duplicate_rate,
    duplicate_rate - baseline_duplicate_rate AS duplicate_lift,
    payout_variance_usd,
    severity_score
  FROM integration_reliability_events
)
SELECT *
FROM duplicate_lift
WHERE duplicate_lift >= 0.015
ORDER BY payout_variance_usd DESC, severity_score DESC;

-- 2. Separate source-data issues from integration-logic issues.
SELECT
  likely_owner,
  issue_type,
  COUNT(*) AS incident_rows,
  AVG(severity_score) AS avg_severity,
  SUM(impacted_customers) AS impacted_customers,
  SUM(ABS(payout_variance_usd)) AS absolute_payout_variance
FROM integration_reliability_events
WHERE severity_score >= 60
GROUP BY likely_owner, issue_type
ORDER BY avg_severity DESC;

-- 3. Identify schema drift that coincides with malformed payloads or data gaps.
SELECT
  date,
  feed_name,
  schema_drift_fields,
  malformed_payload_rate,
  data_gap_rate,
  anomaly_reason,
  severity_score
FROM integration_reliability_events
WHERE schema_drift_fields >= 6
   OR malformed_payload_rate >= 0.02
   OR data_gap_rate >= 0.12
ORDER BY severity_score DESC;

-- 4. Prioritize incidents by business impact rather than alert count.
SELECT
  date,
  feed_name,
  integration_type,
  issue_type,
  likely_owner,
  impacted_customers,
  payout_variance_usd,
  severity_score,
  CASE
    WHEN severity_score >= 80 OR ABS(payout_variance_usd) >= 20000 THEN 'P0 review'
    WHEN severity_score >= 60 OR impacted_customers >= 40 THEN 'P1 review'
    ELSE 'Monitor'
  END AS triage_priority
FROM integration_reliability_events
WHERE severity_score >= 55
ORDER BY
  CASE
    WHEN severity_score >= 80 OR ABS(payout_variance_usd) >= 20000 THEN 1
    WHEN severity_score >= 60 OR impacted_customers >= 40 THEN 2
    ELSE 3
  END,
  severity_score DESC;
