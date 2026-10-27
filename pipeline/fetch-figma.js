// pipeline/fetch-figma.js
// Goal: download our Figma file's data and save it as JSON.

// 'fs' lets us read/write files; 'path' helps us build file paths.
const fs = require('fs');
const path = require('path');

// Read our secrets. Node loads them from .env (see the run command below).
const token = process.env.FIGMA_TOKEN;
const fileKey = process.env.FIGMA_FILE_KEY;

// Stop early with a clear message if either secret is missing.
if (!token || !fileKey) {
  console.error('Missing FIGMA_TOKEN or FIGMA_FILE_KEY in .env');
  process.exit(1);
}

// 'async' lets us use 'await' to wait for slow things like network requests.
async function main() {
  // The endpoint: Figma's address for "give me this file".
  const url = `https://api.figma.com/v1/files/${fileKey}`;
  console.log('Requesting file from Figma...');

  // Send the request. The header is our ID card (the token).
  const response = await fetch(url, {
    headers: { 'X-Figma-Token': token },
  });

  // If Figma said no, explain why in plain words and stop.
  if (!response.ok) {
    console.error(`Figma API error: ${response.status} ${response.statusText}`);
    if (response.status === 403) {
      console.error('403 = token is wrong, expired, revoked, or missing file_content:read scope.');
    } else if (response.status === 404) {
      console.error('404 = file key is wrong, or this account cannot open that file.');
    } else if (response.status === 429) {
      console.error('429 = too many requests. Wait a minute and try again.');
    }
    process.exit(1);
  }

  // Turn Figma's reply (text) into a JavaScript object we can inspect.
  const data = await response.json();

  // Build the save location: <project>/output/figma-file.json
  const outPath = path.join(__dirname, '..', 'output', 'figma-file.json');

  // Save it, nicely indented (2 spaces) so humans can read it.
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2));

  console.log('Saved raw file to output/figma-file.json');
  console.log('File name:', data.name);
  console.log('Styles found:', Object.keys(data.styles || {}).length);
}

// Start the function.
main();