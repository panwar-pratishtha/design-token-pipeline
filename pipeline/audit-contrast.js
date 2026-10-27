// pipeline/audit-contrast.js
// Goal: check text/background color pairs against WCAG AA contrast rules
// and save the results as audit-report.json.

const fs = require('fs');
const path = require('path');

const tokensPath = path.join(__dirname, '..', 'output', 'tokens.json');
const reportPath = path.join(__dirname, '..', 'output', 'audit-report.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

// Turn "#1d4ed8" into { r: 29, g: 78, b: 216 }.
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// Step 1a: convert one color channel (0-255) to its "linear light" value.
function channelToLinear(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Step 1b: relative luminance = how bright the color looks (0 black ... 1 white).
function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (
    0.2126 * channelToLinear(r) +
    0.7152 * channelToLinear(g) +
    0.0722 * channelToLinear(b)
  );
}

// Step 2: the contrast ratio between two colors (1 to 21).
function contrastRatio(hexA, hexB) {
  const la = luminance(hexA);
  const lb = luminance(hexB);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG "large text": at least 24px, or at least 18.66px and bold.
function isLargeText(size, weight) {
  return size >= 24 || (size >= 18.66 && weight >= 700);
}

// Self-test: black on white must be exactly 21:1, or our math is wrong.
const selfTest = contrastRatio('#000000', '#ffffff');
if (Math.abs(selfTest - 21) > 0.01) {
  console.error('Self-test FAILED: black on white gave', selfTest);
  process.exit(1);
}
console.log('Self-test passed: black on white = 21:1');

// The text/background pairs we want to check (names come from tokens.json).
const pairs = [
  { name: 'Body text on page background', fg: 'text', bg: 'background', font: 'body' },
  { name: 'Body text on surface (cards)', fg: 'text', bg: 'surface', font: 'body' },
  { name: 'Heading on page background', fg: 'text', bg: 'background', font: 'heading' },
  { name: 'Caption on surface', fg: 'text', bg: 'surface', font: 'caption' },
  { name: 'Button label on primary', fg: 'on-primary', bg: 'primary', font: 'body' },
  { name: 'Primary link on page background', fg: 'primary', bg: 'background', font: 'body' },
];

// Check each pair and build a result object for it.
const results = pairs.map((p) => {
  const fgHex = tokens.color[p.fg];
  const bgHex = tokens.color[p.bg];
  const font = tokens.font[p.font];
  if (!fgHex || !bgHex || !font) {
    throw new Error(`Missing token for pair "${p.name}"`);
  }

  const large = isLargeText(font.size, font.weight);
  const required = large ? 3 : 4.5;
  const ratio = contrastRatio(fgHex, bgHex);

  return {
    name: p.name,
    foreground: p.fg,
    background: p.bg,
    foregroundHex: fgHex,
    backgroundHex: bgHex,
    fontSize: font.size,
    fontWeight: font.weight,
    textSize: large ? 'large' : 'normal',
    required,
    ratio: Math.round(ratio * 100) / 100, // rounded only for display
    passAA: ratio >= required,            // compared using the exact value
  };
});

// Show a table in the terminal.
console.table(
  results.map((r) => ({
    Pair: r.name,
    Ratio: r.ratio,
    Needs: r.required,
    Result: r.passAA ? 'PASS' : 'FAIL',
  }))
);

// Save the full report as JSON.
const report = {
  generatedAt: new Date().toISOString(),
  standard: 'WCAG 2.x Level AA (text contrast)',
  passed: results.filter((r) => r.passAA).length,
  failed: results.filter((r) => !r.passAA).length,
  results,
};
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`Saved output/audit-report.json (${report.passed} passed, ${report.failed} failed)`);