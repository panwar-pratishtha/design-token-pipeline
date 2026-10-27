// pipeline/extract-tokens.js
// Goal: read the saved Figma file and pull out design tokens
// (colors and text styles), then save them as tokens.json.

const fs = require('fs');
const path = require('path');

// Input: the raw file saved by fetch-figma.js. Output: our clean tokens.
const inPath = path.join(__dirname, '..', 'output', 'figma-file.json');
const outPath = path.join(__dirname, '..', 'output', 'tokens.json');

// Read the file as text, then turn the text into a JavaScript object.
const figma = JSON.parse(fs.readFileSync(inPath, 'utf8'));

// figma.styles is a lookup table: style ID -> { name, styleType, ... }
const styleTable = figma.styles || {};

// Convert a Figma color (numbers from 0 to 1) into a hex code like #1d4ed8.
function toHex(color) {
  const part = (v) => Math.round(v * 255).toString(16).padStart(2, '0');
  return '#' + part(color.r) + part(color.g) + part(color.b);
}

// Tidy a style name: lowercase it, and fix the "colour" typo.
function cleanName(name) {
  return name.trim().toLowerCase().replace(/^colour/, 'color');
}

// Our result. Spacing is written by hand (it is NOT read from Figma).
const tokens = {
  color: {},
  font: {},
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
};

// Add one token. If the same name appears twice with different values, warn.
function addToken(group, key, value, name) {
  const existing = group[key];
  if (existing !== undefined && JSON.stringify(existing) !== JSON.stringify(value)) {
    console.warn(`WARNING: "${name}" has two different values. Keeping the first.`);
    return;
  }
  group[key] = value;
}

// Look at one node, then call ourselves on each child node (recursion).
function visit(node) {
  if (node.styles) {
    // node.styles lists the style IDs used by this node.
    for (const styleId of Object.values(node.styles)) {
      const style = styleTable[styleId];
      if (!style) continue;

      const name = cleanName(style.name);   // e.g. "color/primary"
      const [group, key] = name.split('/'); // "color" and "primary"

      if (style.styleType === 'FILL' && group === 'color' && key) {
        // A color style: read the box's first fill color.
        const fill = node.fills && node.fills[0];
        if (fill && fill.color) {
          addToken(tokens.color, key, toHex(fill.color), name);
        }
      } else if (style.styleType === 'TEXT' && group === 'text' && key) {
        // A text style: read the font settings from the text node.
        const t = node.style;
        if (t) {
          addToken(tokens.font, key, {
            family: t.fontFamily,
            size: t.fontSize,
            weight: t.fontWeight,
            lineHeight: Math.round(t.lineHeightPx),
          }, name);
        }
      } else {
        console.log('Skipped style:', style.name);
      }
    }
  }
  // Visit everything inside this node.
  for (const child of node.children || []) {
    visit(child);
  }
}

// Start from the top of the file.
visit(figma.document);

// Check that nothing we expect is missing.
const expectedColors = ['background', 'surface', 'text', 'primary', 'on-primary'];
const expectedFonts = ['heading', 'body', 'caption'];
for (const k of expectedColors) {
  if (!tokens.color[k]) console.warn(`MISSING color token: ${k}`);
}
for (const k of expectedFonts) {
  if (!tokens.font[k]) console.warn(`MISSING text token: ${k}`);
}

// Save the clean tokens and show them on screen.
fs.writeFileSync(outPath, JSON.stringify(tokens, null, 2));
console.log('Tokens extracted:');
console.log(JSON.stringify(tokens, null, 2));
console.log('Saved to output/tokens.json');