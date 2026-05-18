window.dashboardData = {
  "metrics": [
    {
      "label": "Feeds monitored",
      "value": "10",
      "caption": "API, webhook, CSV, FTP, pixel, server",
      "tone": "neutral"
    },
    {
      "label": "High-severity incidents",
      "value": "2",
      "caption": "root-cause review required",
      "tone": "risk"
    },
    {
      "label": "Duplicate event rate",
      "value": "1.0%",
      "caption": "latest day weighted signal",
      "tone": "warn"
    },
    {
      "label": "Validation coverage",
      "value": "84%",
      "caption": "rules active across key feeds",
      "tone": "good"
    },
    {
      "label": "Payout exposure",
      "value": "$43k",
      "caption": "estimated open variance",
      "tone": "risk"
    }
  ],
  "incidents": [
    {
      "feed": "Referral Webhook / SaaS",
      "signal": "Freshness or missing data",
      "root": "Source data",
      "evidence": "late beyond SLA, event-count gap",
      "impact": "23 impacted",
      "severity": "High",
      "score": 93
    },
    {
      "feed": "FTP Batch / Home Goods",
      "signal": "Freshness or missing data",
      "root": "Source data",
      "evidence": "late beyond SLA, event-count gap",
      "impact": "39 impacted",
      "severity": "High",
      "score": 81
    },
    {
      "feed": "Affiliate CSV / Retail",
      "signal": "Duplicate conversion replay",
      "root": "Integration logic",
      "evidence": "duplicate lift, payout variance",
      "impact": "$28k exposure",
      "severity": "Medium",
      "score": 74
    },
    {
      "feed": "Creator API / Beauty",
      "signal": "Schema or payload drift",
      "root": "Integration logic",
      "evidence": "schema drift, malformed payloads",
      "impact": "45 impacted",
      "severity": "Medium",
      "score": 69
    },
    {
      "feed": "Server Postback / Fashion",
      "signal": "Duplicate conversion replay",
      "root": "Integration logic",
      "evidence": "duplicate lift, payout variance",
      "impact": "$13k exposure",
      "severity": "Medium",
      "score": 66
    }
  ],
  "trend": [
    {
      "date": "05-04",
      "severity": 28,
      "incidents": 0
    },
    {
      "date": "05-05",
      "severity": 29,
      "incidents": 0
    },
    {
      "date": "05-06",
      "severity": 31,
      "incidents": 0
    },
    {
      "date": "05-07",
      "severity": 29,
      "incidents": 0
    },
    {
      "date": "05-08",
      "severity": 30,
      "incidents": 0
    },
    {
      "date": "05-09",
      "severity": 30,
      "incidents": 0
    },
    {
      "date": "05-10",
      "severity": 32,
      "incidents": 0
    },
    {
      "date": "05-11",
      "severity": 32,
      "incidents": 0
    },
    {
      "date": "05-12",
      "severity": 38,
      "incidents": 1
    },
    {
      "date": "05-13",
      "severity": 39,
      "incidents": 2
    },
    {
      "date": "05-14",
      "severity": 34,
      "incidents": 1
    },
    {
      "date": "05-15",
      "severity": 35,
      "incidents": 1
    },
    {
      "date": "05-16",
      "severity": 31,
      "incidents": 0
    },
    {
      "date": "05-17",
      "severity": 31,
      "incidents": 0
    }
  ],
  "diagnostics": [
    {
      "feed": "Referral Webhook / SaaS",
      "type": "Webhook",
      "owner": "Referral integrations",
      "score": 93,
      "band": "High",
      "issue": "Freshness or missing data",
      "likelyOwner": "Source data",
      "evidence": "late beyond SLA, event-count gap",
      "customerImpact": "23 accounts or partners",
      "productAction": "Route stale or incomplete batches through owner-specific retry playbooks."
    },
    {
      "feed": "FTP Batch / Home Goods",
      "type": "FTP",
      "owner": "Affiliate integrations",
      "score": 81,
      "band": "High",
      "issue": "Freshness or missing data",
      "likelyOwner": "Source data",
      "evidence": "late beyond SLA, event-count gap",
      "customerImpact": "39 accounts or partners",
      "productAction": "Route stale or incomplete batches through owner-specific retry playbooks."
    },
    {
      "feed": "Affiliate CSV / Retail",
      "type": "CSV",
      "owner": "Affiliate integrations",
      "score": 74,
      "band": "Medium",
      "issue": "Duplicate conversion replay",
      "likelyOwner": "Integration logic",
      "evidence": "duplicate lift, payout variance",
      "customerImpact": "85 accounts or partners",
      "productAction": "Block replayed conversion ids before commission calculation."
    },
    {
      "feed": "Creator API / Beauty",
      "type": "API",
      "owner": "Creator integrations",
      "score": 69,
      "band": "Medium",
      "issue": "Schema or payload drift",
      "likelyOwner": "Integration logic",
      "evidence": "schema drift, malformed payloads",
      "customerImpact": "45 accounts or partners",
      "productAction": "Version payload contracts and alert on required field drift."
    },
    {
      "feed": "Server Postback / Fashion",
      "type": "Server",
      "owner": "Tracking",
      "score": 66,
      "band": "Medium",
      "issue": "Duplicate conversion replay",
      "likelyOwner": "Integration logic",
      "evidence": "duplicate lift, payout variance",
      "customerImpact": "44 accounts or partners",
      "productAction": "Block replayed conversion ids before commission calculation."
    }
  ],
  "rules": [
    {
      "rule": "Freshness SLA",
      "coverage": 92,
      "threshold": "Feed arrives within type-specific SLA",
      "catches": "Late CSV and stalled webhook jobs"
    },
    {
      "rule": "Schema contract",
      "coverage": 86,
      "threshold": "Required fields present and type-stable",
      "catches": "Payload version mismatch"
    },
    {
      "rule": "Duplicate conversion id",
      "coverage": 81,
      "threshold": "Conversion id uniqueness across retry windows",
      "catches": "Replay after timeout"
    },
    {
      "rule": "Payout reconciliation",
      "coverage": 74,
      "threshold": "Tracked commission matches expected payout",
      "catches": "Currency and rule variance"
    },
    {
      "rule": "Customer impact map",
      "coverage": 67,
      "threshold": "Incident linked to accounts, partners, and exposure",
      "catches": "Unprioritized support escalations"
    }
  ],
  "waterfall": [
    {
      "label": "Base reliability",
      "value": 94,
      "type": "base"
    },
    {
      "label": "Schema drift",
      "value": -8,
      "type": "bad"
    },
    {
      "label": "Duplicate replay",
      "value": -7,
      "type": "bad"
    },
    {
      "label": "Payout variance",
      "value": -6,
      "type": "bad"
    },
    {
      "label": "Freshness recovery",
      "value": 4,
      "type": "good"
    },
    {
      "label": "Final score",
      "value": 77,
      "type": "base"
    }
  ],
  "recommendations": [
    {
      "title": "Create feed-level reliability contracts",
      "body": "Define required fields, delivery SLA, uniqueness keys, and payout reconciliation tolerances for every high-volume integration type."
    },
    {
      "title": "Move duplicate checks upstream",
      "body": "Reject replayed conversion ids before commission calculation so payout exposure does not become a finance or support cleanup."
    },
    {
      "title": "Prioritize incidents by business impact",
      "body": "Rank alerts by affected accounts, partner count, payout variance, and dashboard visibility so engineering and customer teams share the same triage order."
    }
  ],
  "sqlQuestions": [
    "Which feeds have duplicate-rate lift above the 95th percentile of their own baseline?",
    "Which schema changes coincide with malformed payload spikes or event-count gaps?",
    "Which payout variances are material enough to pause automated partner settlement review?"
  ]
};
