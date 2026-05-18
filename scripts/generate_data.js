const fs = require("node:fs");
const path = require("node:path");

const outDir = path.join(__dirname, "..");

function makeRandom(seed) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const random = makeRandom(20260517);
const days = 35;
const start = new Date("2026-04-13T00:00:00Z");

const feeds = [
  { id: "api-beauty", name: "Creator API / Beauty", type: "API", vertical: "Beauty", owner: "Creator integrations", baseEvents: 184000, duplicateBase: 0.012, sla: 20, partnerCount: 410 },
  { id: "csv-retail", name: "Affiliate CSV / Retail", type: "CSV", vertical: "Retail", owner: "Affiliate integrations", baseEvents: 242000, duplicateBase: 0.018, sla: 240, partnerCount: 720 },
  { id: "pixel-travel", name: "Publisher Pixel / Travel", type: "Pixel", vertical: "Travel", owner: "Tracking", baseEvents: 97000, duplicateBase: 0.011, sla: 15, partnerCount: 290 },
  { id: "webhook-saas", name: "Referral Webhook / SaaS", type: "Webhook", vertical: "SaaS", owner: "Referral integrations", baseEvents: 65000, duplicateBase: 0.008, sla: 10, partnerCount: 180 },
  { id: "csv-finance", name: "Content Partner CSV / Finance", type: "CSV", vertical: "Finance", owner: "Publisher data", baseEvents: 52000, duplicateBase: 0.006, sla: 360, partnerCount: 130 },
  { id: "api-marketplace", name: "Product API / Marketplace", type: "API", vertical: "Marketplace", owner: "Catalog integrations", baseEvents: 128000, duplicateBase: 0.01, sla: 30, partnerCount: 510 },
  { id: "server-fashion", name: "Server Postback / Fashion", type: "Server", vertical: "Fashion", owner: "Tracking", baseEvents: 156000, duplicateBase: 0.013, sla: 20, partnerCount: 460 },
  { id: "webhook-food", name: "Referral Webhook / Food", type: "Webhook", vertical: "Food", owner: "Referral integrations", baseEvents: 73000, duplicateBase: 0.007, sla: 10, partnerCount: 210 },
  { id: "ftp-home", name: "FTP Batch / Home Goods", type: "FTP", vertical: "Home Goods", owner: "Affiliate integrations", baseEvents: 111000, duplicateBase: 0.014, sla: 300, partnerCount: 340 },
  { id: "api-mobile", name: "Mobile API / Apps", type: "API", vertical: "Mobile Apps", owner: "Mobile integrations", baseEvents: 88000, duplicateBase: 0.009, sla: 20, partnerCount: 250 }
];

const injectedEvents = {
  "api-beauty": { day: 30, kind: "Payload version mismatch", schema: 14, malformed: 0.037, source: 2, integration: 8 },
  "csv-retail": { day: 31, kind: "Retry replay after timeout", duplicate: 0.046, payout: 27800, source: 1, integration: 9 },
  "pixel-travel": { day: 28, kind: "Currency transform bug", payout: 19300, malformed: 0.019, source: 1, integration: 7 },
  "webhook-saas": { day: 29, kind: "Expired customer token", gap: 0.26, late: 64, source: 8, integration: 2 },
  "ftp-home": { day: 32, kind: "Late batch delivery", late: 690, gap: 0.18, source: 7, integration: 1 },
  "server-fashion": { day: 30, kind: "Duplicate conversion id accepted", duplicate: 0.039, payout: 13200, source: 2, integration: 8 }
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalish() {
  return random() + random() + random() - 1.5;
}

function dateFor(index) {
  const d = new Date(start);
  d.setUTCDate(start.getUTCDate() + index);
  return d.toISOString().slice(0, 10);
}

function riskBand(score) {
  if (score >= 80) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

function issueType(row) {
  if (row.schema_drift_fields >= 8 || row.malformed_payload_rate >= 0.025) return "Schema or payload drift";
  if (row.duplicate_rate >= 0.033) return "Duplicate conversion replay";
  if (Math.abs(row.payout_variance_usd) >= 12000) return "Payout reconciliation gap";
  if (row.minutes_late > row.sla_minutes * 1.8 || row.data_gap_rate > 0.15) return "Freshness or missing data";
  return "Baseline variation";
}

function likelyOwner(row) {
  if (row.source_error_score > row.integration_error_score + 2) return "Source data";
  if (row.integration_error_score > row.source_error_score + 2) return "Integration logic";
  return "Edge case or shared ownership";
}

function anomalyReason(row) {
  const reasons = [];
  if (row.minutes_late > row.sla_minutes * 1.8) reasons.push("late beyond SLA");
  if (row.duplicate_rate >= 0.03) reasons.push("duplicate lift");
  if (row.schema_drift_fields >= 6) reasons.push("schema drift");
  if (Math.abs(row.payout_variance_usd) >= 10000) reasons.push("payout variance");
  if (row.data_gap_rate >= 0.12) reasons.push("event-count gap");
  if (row.malformed_payload_rate >= 0.02) reasons.push("malformed payloads");
  return reasons.length ? reasons.join(", ") : "within control band";
}

const rows = [];

for (let day = 0; day < days; day += 1) {
  feeds.forEach((feed) => {
    const weekly = 1 + Math.sin((day / 7) * Math.PI * 2) * 0.08;
    const volumeNoise = normalish() * 0.05;
    const expected = Math.round(feed.baseEvents * weekly);
    let eventCount = Math.round(expected * (1 + volumeNoise));
    let minutesLate = Math.round(Math.max(0, feed.sla * (0.45 + random() * 0.55 + Math.max(0, normalish()) * 0.35)));
    let duplicateRate = clamp(feed.duplicateBase + normalish() * 0.004, 0.002, 0.055);
    let schemaDrift = Math.max(0, Math.round(random() < 0.18 ? 1 + random() * 3 : random() * 1));
    let payoutVariance = Math.round(normalish() * 1800 + feed.baseEvents * duplicateRate * 0.05);
    let malformedRate = clamp(0.003 + normalish() * 0.003, 0, 0.04);
    let dataGap = clamp(Math.max(0, 1 - eventCount / expected), 0, 0.4);
    let sourceErrors = Math.round(random() * 3);
    let integrationErrors = Math.round(random() * 3);

    const injected = injectedEvents[feed.id];
    if (injected && injected.day === day) {
      if (injected.schema) schemaDrift = injected.schema;
      if (injected.duplicate) duplicateRate = injected.duplicate;
      if (injected.payout) payoutVariance = injected.payout;
      if (injected.malformed) malformedRate = injected.malformed;
      if (injected.gap) {
        dataGap = injected.gap;
        eventCount = Math.round(expected * (1 - dataGap));
      }
      if (injected.late) minutesLate = injected.late;
      sourceErrors = injected.source;
      integrationErrors = injected.integration;
    }

    const freshnessScore = clamp(((minutesLate - feed.sla) / feed.sla) * 26, 0, 30);
    const duplicateScore = clamp(((duplicateRate - feed.duplicateBase) / 0.025) * 24, 0, 26);
    const schemaScore = clamp(schemaDrift * 4.5, 0, 28);
    const payoutScore = clamp(Math.abs(payoutVariance) / 1000, 0, 24);
    const gapScore = clamp(dataGap * 100, 0, 24);
    const malformedScore = clamp(malformedRate * 520, 0, 18);
    const severity = Math.round(clamp(22 + freshnessScore + duplicateScore + schemaScore + payoutScore + gapScore + malformedScore, 0, 100));
    const impactedCustomers = Math.round(clamp(feed.partnerCount * (0.02 + severity / 900 + random() * 0.02), 1, feed.partnerCount * 0.35));

    rows.push({
      date: dateFor(day),
      feed_id: feed.id,
      feed_name: feed.name,
      integration_type: feed.type,
      vertical: feed.vertical,
      owner: feed.owner,
      event_count: eventCount,
      expected_events: expected,
      minutes_late: minutesLate,
      sla_minutes: feed.sla,
      duplicate_rate: Number(duplicateRate.toFixed(4)),
      baseline_duplicate_rate: Number(feed.duplicateBase.toFixed(4)),
      schema_drift_fields: schemaDrift,
      malformed_payload_rate: Number(malformedRate.toFixed(4)),
      payout_variance_usd: payoutVariance,
      data_gap_rate: Number(dataGap.toFixed(4)),
      impacted_customers: impactedCustomers,
      source_error_score: sourceErrors,
      integration_error_score: integrationErrors,
      severity_score: severity,
      severity_band: riskBand(severity),
      issue_type: null,
      likely_owner: null,
      anomaly_reason: null,
      status: severity >= 80 ? "Open" : severity >= 60 ? "Watch" : "Healthy"
    });
  });
}

rows.forEach((row) => {
  row.issue_type = issueType(row);
  row.likely_owner = likelyOwner(row);
  row.anomaly_reason = anomalyReason(row);
});

const latestDate = dateFor(days - 1);
const latestRows = rows.filter((row) => row.date === latestDate);
const openIncidents = rows
  .filter((row) => row.severity_score >= 60)
  .sort((a, b) => b.severity_score - a.severity_score)
  .slice(0, 12);

const totalFeeds = feeds.length;
const highSeverity = openIncidents.filter((row) => row.severity_score >= 80).length;
const payoutExposure = openIncidents.reduce((sum, row) => sum + Math.max(0, Math.abs(row.payout_variance_usd)), 0);
const validationCoverage = 84;
const duplicateRate = latestRows.reduce((sum, row) => sum + row.duplicate_rate, 0) / latestRows.length;

const dailyTrend = Array.from({ length: 14 }, (_, offset) => {
  const day = days - 14 + offset;
  const dayRows = rows.filter((row) => row.date === dateFor(day));
  const avgSeverity = dayRows.reduce((sum, row) => sum + row.severity_score, 0) / dayRows.length;
  const incidentCount = dayRows.filter((row) => row.severity_score >= 60).length;
  return { date: dateFor(day).slice(5), severity: Math.round(avgSeverity), incidents: incidentCount };
});

const diagnostics = openIncidents.slice(0, 6).map((row) => ({
  feed: row.feed_name,
  type: row.integration_type,
  owner: row.owner,
  score: row.severity_score,
  band: row.severity_band,
  issue: row.issue_type,
  likelyOwner: row.likely_owner,
  evidence: row.anomaly_reason,
  customerImpact: `${row.impacted_customers} accounts or partners`,
  productAction: row.issue_type.includes("Duplicate")
    ? "Block replayed conversion ids before commission calculation."
    : row.issue_type.includes("Payout")
      ? "Add reconciliation tolerances by currency and payout rule."
      : row.issue_type.includes("Schema")
        ? "Version payload contracts and alert on required field drift."
        : "Route stale or incomplete batches through owner-specific retry playbooks."
}));

const ruleMatrix = [
  { rule: "Freshness SLA", coverage: 92, threshold: "Feed arrives within type-specific SLA", catches: "Late CSV and stalled webhook jobs" },
  { rule: "Schema contract", coverage: 86, threshold: "Required fields present and type-stable", catches: "Payload version mismatch" },
  { rule: "Duplicate conversion id", coverage: 81, threshold: "Conversion id uniqueness across retry windows", catches: "Replay after timeout" },
  { rule: "Payout reconciliation", coverage: 74, threshold: "Tracked commission matches expected payout", catches: "Currency and rule variance" },
  { rule: "Customer impact map", coverage: 67, threshold: "Incident linked to accounts, partners, and exposure", catches: "Unprioritized support escalations" }
];

const dashboardData = {
  metrics: [
    { label: "Feeds monitored", value: String(totalFeeds), caption: "API, webhook, CSV, FTP, pixel, server", tone: "neutral" },
    { label: "High-severity incidents", value: String(highSeverity), caption: "root-cause review required", tone: "risk" },
    { label: "Duplicate event rate", value: `${(duplicateRate * 100).toFixed(1)}%`, caption: "latest day weighted signal", tone: "warn" },
    { label: "Validation coverage", value: `${validationCoverage}%`, caption: "rules active across key feeds", tone: "good" },
    { label: "Payout exposure", value: `$${Math.round(payoutExposure / 1000)}k`, caption: "estimated open variance", tone: "risk" }
  ],
  incidents: openIncidents.slice(0, 8).map((row) => ({
    feed: row.feed_name,
    signal: row.issue_type,
    root: row.likely_owner,
    evidence: row.anomaly_reason,
    impact: row.payout_variance_usd > 5000 ? `$${Math.round(row.payout_variance_usd / 1000)}k exposure` : `${row.impacted_customers} impacted`,
    severity: row.severity_band,
    score: row.severity_score
  })),
  trend: dailyTrend,
  diagnostics,
  rules: ruleMatrix,
  waterfall: [
    { label: "Base reliability", value: 94, type: "base" },
    { label: "Schema drift", value: -8, type: "bad" },
    { label: "Duplicate replay", value: -7, type: "bad" },
    { label: "Payout variance", value: -6, type: "bad" },
    { label: "Freshness recovery", value: 4, type: "good" },
    { label: "Final score", value: 77, type: "base" }
  ],
  recommendations: [
    { title: "Create feed-level reliability contracts", body: "Define required fields, delivery SLA, uniqueness keys, and payout reconciliation tolerances for every high-volume integration type." },
    { title: "Move duplicate checks upstream", body: "Reject replayed conversion ids before commission calculation so payout exposure does not become a finance or support cleanup." },
    { title: "Prioritize incidents by business impact", body: "Rank alerts by affected accounts, partner count, payout variance, and dashboard visibility so engineering and customer teams share the same triage order." }
  ],
  sqlQuestions: [
    "Which feeds have duplicate-rate lift above the 95th percentile of their own baseline?",
    "Which schema changes coincide with malformed payload spikes or event-count gaps?",
    "Which payout variances are material enough to pause automated partner settlement review?"
  ]
};

const csvHeaders = Object.keys(rows[0]);
const csv = [
  csvHeaders.join(","),
  ...rows.map((row) => csvHeaders.map((field) => JSON.stringify(row[field] ?? "")).join(","))
].join("\n");

const incidentHeaders = ["date", "feed_name", "integration_type", "issue_type", "likely_owner", "anomaly_reason", "impacted_customers", "payout_variance_usd", "severity_score", "severity_band"];
const incidentCsv = [
  incidentHeaders.join(","),
  ...openIncidents.map((row) => incidentHeaders.map((field) => JSON.stringify(row[field] ?? "")).join(","))
].join("\n");

fs.mkdirSync(path.join(outDir, "data"), { recursive: true });
fs.writeFileSync(path.join(outDir, "data", "integration_reliability_events.csv"), csv);
fs.writeFileSync(path.join(outDir, "data", "reliability_incidents.csv"), incidentCsv);
fs.writeFileSync(path.join(outDir, "src", "data.js"), `window.dashboardData = ${JSON.stringify(dashboardData, null, 2)};\n`);

console.log(`Generated ${rows.length} event rows and ${openIncidents.length} incident rows.`);
