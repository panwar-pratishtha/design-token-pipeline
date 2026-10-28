# Accessible Design Token Pipeline

A small pipeline that pulls a Figma design system, turns it into CSS design tokens, audits text contrast against WCAG, and feeds a React demo app that can switch between three accessibility profiles at runtime.

Built as an internship project (Software Development Intern, user-centered design focus).

## What it does

1. **Fetch**: reads a Figma file through the Figma REST API (`GET /v1/files/:key` and `GET /v1/files/:key/styles`).
2. **Extract**: turns Figma Color Styles and Text Styles into `output/tokens.json`. Spacing values are defined by hand, not read from Figma.
3. **Generate**: writes `output/tokens.css` (CSS variables) and copies it into the React app.
4. **Audit**: checks 6 text/background pairs for the Default and High Contrast profiles against WCAG 2.x AA (4.5:1 normal text, 3:1 large text). Output: `audit-report.json` and `audit-report.html`.
5. **Demo app**: React (Vite) with 4 hand-written accessible components (Button, Input, Card, Heading) that use tokens only, with no hard-coded colors. A settings panel switches profiles by overriding token values.

## Folder structure

```
pipeline/       Node scripts (fetch, extract, build CSS, audit, build HTML report)
output/         Generated files (tokens.json, tokens.css, audit reports)
demo-app/       Vite + React demo app
report-assets/  Screenshots for the project report
```

## Setup

You need Node.js 20.19 or newer and a free Figma account.

1. Create a file named `.env` in the project root with your own Figma details (this file is never committed):
   ```
   FIGMA_TOKEN=your_personal_access_token
   FIGMA_FILE_KEY=your_file_key
   ```
2. Install the demo app's packages:
   ```
   cd demo-app
   npm install
   cd ..
   ```

## Run the pipeline

From the project root, in this order:

```
node pipeline/fetch-figma.js
node pipeline/extract-tokens.js
node pipeline/build-css.js
node pipeline/audit-contrast.js
node pipeline/build-report-html.js
```

Then open `output/audit-report.html` in a browser.

## Run the demo app

```
cd demo-app
npm run dev
```

Open the address shown in the terminal (usually http://localhost:5173/).

## Accessibility profiles

| Profile | What changes |
|---|---|
| Default | Tokens from Figma |
| High Contrast | Black background, white text, yellow accent (all 6 audited pairs above 7:1) |
| Dyslexia-friendly | Verdana font, larger text, taller line height, more spacing |

Profiles are CSS blocks in `demo-app/src/profiles.css` that override token values when `<html data-profile="...">` is set. Component code is not changed by profiles.

## Limitations

- Only Default tokens come from Figma. The High Contrast and Dyslexia profiles are hand-written.
- The contrast audit covers 6 listed pairs per profile, not the whole interface. The Dyslexia profile is not audited because its colors equal Default.
- The Dyslexia profile uses a common readable system font, not a specialised dyslexia font, and it makes no medical claim.
- The selected profile is not saved after a page refresh.
- The Figma Variables API needs an Enterprise plan, so tokens are read from Color and Text Styles instead.