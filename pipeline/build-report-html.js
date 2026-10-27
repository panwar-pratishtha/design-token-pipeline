// pipeline/build-report-html.js
// Goal: turn output/audit-report.json into a readable web page,
// output/audit-report.html.

const fs = require('fs');
const path = require('path');

// Input: the JSON report. Output: the HTML page.
const reportPath = path.join(__dirname, '..', 'output', 'audit-report.json');
const htmlPath = path.join(__dirname, '..', 'output', 'audit-report.html');

// Read the JSON report and turn the text into an object.
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

// Make text safe to put inside HTML (so < > & " can't break the page).
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Build one table row per audit result.
const rows = report.results
  .map((r) => {
    const status = r.passAA ? 'PASS' : 'FAIL';
    const cssClass = r.passAA ? 'pass' : 'fail';
    return `
      <tr>
        <th scope="row">${escapeHtml(r.name)}</th>
        <td><span class="swatch" aria-hidden="true" style="background:${escapeHtml(r.foregroundHex)}"></span>${escapeHtml(r.foregroundHex)}</td>
        <td><span class="swatch" aria-hidden="true" style="background:${escapeHtml(r.backgroundHex)}"></span>${escapeHtml(r.backgroundHex)}</td>
        <td>${escapeHtml(r.fontSize)}px / ${escapeHtml(r.fontWeight)} (${escapeHtml(r.textSize)})</td>
        <td>${escapeHtml(r.ratio)}:1</td>
        <td>${escapeHtml(r.required)}:1</td>
        <td class="${cssClass}">${status}</td>
      </tr>`;
  })
  .join('');

// The whole page as one piece of text, with the data filled in.
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Contrast Audit Report</title>
  <style>
    body { font-family: system-ui, sans-serif; color: #111827; background: #ffffff; margin: 0 auto; padding: 24px; max-width: 1000px; line-height: 1.5; }
    table { border-collapse: collapse; width: 100%; }
    caption { text-align: left; font-weight: 700; padding-bottom: 8px; }
    th, td { border: 1px solid #9ca3af; padding: 8px; text-align: left; }
    thead th { background: #f3f4f6; }
    .swatch { display: inline-block; width: 16px; height: 16px; border: 1px solid #111827; margin-right: 6px; vertical-align: middle; }
    .pass { background: #dcfce7; color: #166534; font-weight: 700; }
    .fail { background: #fee2e2; color: #991b1b; font-weight: 700; }
  </style>
</head>
<body>
  <main>
    <h1>Contrast Audit Report</h1>
    <p>Standard: ${escapeHtml(report.standard)}</p>
    <p>Generated: ${escapeHtml(report.generatedAt)}</p>
    <p><strong>${escapeHtml(report.passed)} passed, ${escapeHtml(report.failed)} failed</strong></p>
    <table>
      <caption>Text and background color pairs checked against WCAG AA</caption>
      <thead>
        <tr>
          <th scope="col">Pair</th>
          <th scope="col">Text color</th>
          <th scope="col">Background</th>
          <th scope="col">Font size / weight</th>
          <th scope="col">Ratio</th>
          <th scope="col">Needs</th>
          <th scope="col">Result</th>
        </tr>
      </thead>
      <tbody>${rows}
      </tbody>
    </table>
    <p>Note: this audit covers only the listed pairs, not the whole interface.</p>
  </main>
</body>
</html>
`;

// Save the page.
fs.writeFileSync(htmlPath, html);
console.log('Saved output/audit-report.html');