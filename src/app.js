const data = window.dashboardData;
const $ = (selector) => document.querySelector(selector);

function node(tag, className, html) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (html) element.innerHTML = html;
  return element;
}

$("#metrics").replaceChildren(...data.metrics.map((metric) => node("article", `metric ${metric.tone}`, `
  <span>${metric.label}</span>
  <strong>${metric.value}</strong>
  <small>${metric.caption}</small>
`)));

$("#incident-table").innerHTML = `
  <table>
    <thead><tr><th>Feed</th><th>Signal</th><th>Likely root cause</th><th>Impact</th><th>Severity</th></tr></thead>
    <tbody>${data.incidents.map((row) => `<tr>
      <td>${row.feed}</td><td>${row.signal}</td><td>${row.root}</td><td>${row.impact}</td><td><b class="${row.severity.toLowerCase()}">${row.severity}</b></td>
    </tr>`).join("")}</tbody>
  </table>
`;

$("#coverage").replaceChildren(...data.coverage.map((item) => node("div", "coverage-row", `
  <div><strong>${item.label}</strong><span>${item.value}%</span></div>
  <div class="bar"><i style="width:${item.value}%"></i></div>
`)));

$("#waterfall").replaceChildren(...data.waterfall.map((item) => {
  const width = item.value < 0 ? Math.abs(item.value) * 3 : item.value;
  return node("div", `water ${item.type}`, `<span>${item.label}</span><div><i style="width:${width}%"></i></div><b>${item.value}${item.type === "base" ? "" : " pts"}</b>`);
}));

$("#recommendations").replaceChildren(...data.recommendations.map((rec, index) => node("article", "memo", `<span>${index + 1}</span><div><h3>${rec.title}</h3><p>${rec.body}</p></div>`)));
