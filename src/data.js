window.dashboardData = {
  metrics: [
    { label: "Feeds monitored", value: "42", caption: "API, webhook, CSV, pixel", tone: "neutral" },
    { label: "High-severity incidents", value: "3", caption: "customer-impacting", tone: "risk" },
    { label: "Duplicate event rate", value: "2.8%", caption: "+1.1 pp WoW", tone: "warn" },
    { label: "Validation coverage", value: "79%", caption: "+12 pp after new checks", tone: "good" }
  ],
  incidents: [
    { feed: "Creator API / Beauty", signal: "Missing coupon_id", root: "Payload version mismatch", impact: "18 advertisers", severity: "High" },
    { feed: "Affiliate CSV / Retail", signal: "Duplicate conversions", root: "Retry replay after timeout", impact: "$22k exposure", severity: "High" },
    { feed: "Publisher Pixel / Travel", signal: "Payout mismatch", root: "Currency transform bug", impact: "$16k exposure", severity: "Medium" },
    { feed: "Advocate Webhook / SaaS", signal: "Event-count drop", root: "Expired customer token", impact: "9 accounts", severity: "Medium" },
    { feed: "Content Partner / Finance", signal: "Late delivery", root: "CSV landed after SLA", impact: "dashboard lag", severity: "Low" }
  ],
  coverage: [
    { label: "Freshness", value: 92 },
    { label: "Schema drift", value: 84 },
    { label: "Duplicate events", value: 76 },
    { label: "Payout reconciliation", value: 68 },
    { label: "Customer-impact mapping", value: 63 }
  ],
  waterfall: [
    { label: "Base reliability", value: 92, type: "base" },
    { label: "Schema drift", value: -9, type: "bad" },
    { label: "Duplicate events", value: -7, type: "bad" },
    { label: "Freshness recovery", value: 5, type: "good" },
    { label: "Final score", value: 81, type: "base" }
  ],
  recommendations: [
    { title: "Ship schema-version monitoring", body: "Alert when payload fields change for top-volume API feeds before downstream dashboards or payout logic consume them." },
    { title: "Move duplicate checks before commission calculation", body: "Block replayed conversion events before finance reconciliation to reduce avoidable payout exposure." },
    { title: "Standardize incident handoffs", body: "Give Product, Engineering, and Customer Success one severity score with root cause, owner, and customer impact." }
  ]
};
