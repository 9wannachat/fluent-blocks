# Run locally

From the project root, select the Node version in .nvmrc.

```bash
nvm use
npm ci
npm run dev
```

For the production build, including service worker behavior:

```bash
npm run build
npm run preview
```

To install Playwright browsers and run the suite:

```bash
npx playwright install chromium webkit
npm run test:e2e
```

# Cloudflare Pages

Use `npm run build` as the build command and `dist` as the output directory. Select Node 24.21.0 in the build environment. The top-level `404.html` is intentionally omitted so Pages serves the SPA shell for deep links. Unknown app routes render the application's missing-page screen. HTTPS is required away from localhost.

On iPhone, open the app URL in Safari, use Share, and choose Add to Home Screen. Wait for the app's offline-ready notice before going offline. Device speech voices and external podcast links may depend on the network.

Browser storage is tied to the app's origin. Use Settings to export a backup before moving to a new URL, browser, or device. Keep the file private because it contains study history and any notebook text.
