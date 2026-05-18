const data = window.dashboardData;
const $ = (selector) => document.querySelector(selector);

function node(tag, className, html) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (html) element.innerHTML = html;
  return element;
}

function severityClass(value) {
  return value.toLowerCase();
}

$("#hero-exposure").textContent = data.metrics.find((metric) => metric.label === "Payout exposure").value;
$("#incident-count").textContent = `${data.incidents.length} active incidents`;

$("#metrics").replaceChildren(...data.metrics.map((metric) => node("article", `metric ${metric.tone}`, `
  <span>${metric.label}</span>
  <strong>${metric.value}</strong>
  <small>${metric.caption}</small>
`)));

$("#incident-table").innerHTML = `
  <table>
    <thead><tr><th>Feed</th><th>Signal</th><th>Likely owner</th><th>Evidence</th><th>Impact</th><th>Score</th></tr></thead>
    <tbody>${data.incidents.map((row) => `<tr>
      <td>${row.feed}</td>
      <td>${row.signal}</td>
      <td>${row.root}</td>
      <td>${row.evidence}</td>
      <td>${row.impact}</td>
      <td><b class="${severityClass(row.severity)}">${row.score}</b></td>
    </tr>`).join("")}</tbody>
  </table>
`;

const maxSeverity = Math.max(...data.trend.map((item) => item.severity));
$("#trend").replaceChildren(...data.trend.map((item) => node("div", "trend-day", `
  <span>${item.date}</span>
  <div class="trend-stack">
    <i style="height:${Math.max(8, (item.severity / maxSeverity) * 100)}%"></i>
    <b style="height:${Math.max(6, item.incidents * 18)}%"></b>
  </div>
`)));

$("#diagnostics").replaceChildren(...data.diagnostics.map((item) => node("article", "diagnostic-card", `
  <div class="card-top">
    <span class="type-chip">${item.type}</span>
    <b class="${severityClass(item.band)}">${item.score}</b>
  </div>
  <h3>${item.feed}</h3>
  <dl>
    <div><dt>Issue</dt><dd>${item.issue}</dd></div>
    <div><dt>Likely owner</dt><dd>${item.likelyOwner}</dd></div>
    <div><dt>Evidence</dt><dd>${item.evidence}</dd></div>
    <div><dt>Impact</dt><dd>${item.customerImpact}</dd></div>
  </dl>
  <p>${item.productAction}</p>
`)));

$("#rules").replaceChildren(...data.rules.map((item) => node("div", "rule-row", `
  <div>
    <strong>${item.rule}</strong>
    <span>${item.threshold}</span>
  </div>
  <div class="bar"><i style="width:${item.coverage}%"></i></div>
  <small>${item.coverage}% coverage, catches ${item.catches}</small>
`)));

$("#waterfall").replaceChildren(...data.waterfall.map((item) => {
  const width = item.value < 0 ? Math.abs(item.value) * 3 : item.value;
  return node("div", `water ${item.type}`, `<span>${item.label}</span><div><i style="width:${width}%"></i></div><b>${item.value}${item.type === "base" ? "" : " pts"}</b>`);
}));

$("#recommendations").replaceChildren(...data.recommendations.map((rec, index) => node("article", "memo", `<span>${index + 1}</span><div><h3>${rec.title}</h3><p>${rec.body}</p></div>`)));

$("#sql-questions").replaceChildren(...data.sqlQuestions.map((question) => node("article", "question", `<span>SQL</span><p>${question}</p>`)));
