# Cypress Compatibility Issue on macOS 15 (Sequoia)

## Problem

Cypress versions up to 13.15.2 have a known compatibility issue with macOS 15.x (Sequoia). The Cypress app fails to start with errors like:

```
/Users/.../Cypress.app/Contents/MacOS/Cypress: bad option: --no-sandbox
/Users/.../Cypress.app/Contents/MacOS/Cypress: bad option: --smoke-test
```

This is a known issue tracked in the Cypress GitHub repository.

## Current Workarounds

### Option 1: Use Docker (Recommended for CI/CD)

Run Cypress tests in a Docker container:

```bash
# Pull Cypress Docker image
docker pull cypress/included:13.15.2

# Run tests
docker run -it -v $PWD:/e2e -w /e2e cypress/included:13.15.2
```

### Option 2: Use a Different Machine

Run tests on:
- macOS 14 (Sonoma) or earlier
- Linux
- Windows
- CI/CD pipeline (GitHub Actions, GitLab CI, etc.)

### Option 3: Use Playwright Instead

Consider switching to Playwright which has better macOS 15 support:

```bash
npm install --save-dev @playwright/test
```

### Option 4: Wait for Cypress Update

Monitor the Cypress GitHub repository for updates. A fix is expected in future versions.

## CI/CD Integration

The tests should work fine in CI/CD environments. Add this to your `.github/workflows/e2e.yml`:

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm start & npx wait-on http://localhost:4200
      - run: npm run e2e:headless
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-videos
          path: cypress/videos
```

## Manual Testing Checklist

Until the Cypress issue is resolved, use this checklist to manually verify e2e scenarios:

### Dashboard Tests
- [ ] Dashboard loads successfully
- [ ] Sidebar is visible
- [ ] Navigation menu exists
- [ ] Breadcrumb displays correctly
- [ ] Can navigate to Projects from dashboard

### Projects List Tests
- [ ] Projects page loads
- [ ] Data table displays
- [ ] Table headers render
- [ ] Add project button exists
- [ ] Search/filter input exists
- [ ] Action buttons work

### Project Creation Tests
- [ ] Add dialog opens
- [ ] Form displays correctly
- [ ] Validation works for required fields
- [ ] Can create new project
- [ ] Cancel button works
- [ ] Dialog closes properly

### Project Update Tests
- [ ] Edit dialog opens
- [ ] Form pre-populates data
- [ ] Can update project
- [ ] Validation works
- [ ] Cancel doesn't save changes

### Theme Toggle Tests
- [ ] Theme toggle button displays
- [ ] Can switch between light/dark
- [ ] Theme persists across navigation
- [ ] Theme persists after reload
- [ ] LocalStorage updated correctly

### Splash Screen Tests
- [ ] Splash screen displays on load
- [ ] Splash screen elements render
- [ ] Splash screen removes after load
- [ ] Works in dark mode

### Navigation Tests
- [ ] Can navigate between pages
- [ ] Breadcrumbs update
- [ ] Browser back/forward works
- [ ] Unknown routes redirect
- [ ] Active nav item highlighted

## References

- [Cypress Issue #30363](https://github.com/cypress-io/cypress/issues/30363)
- [macOS Sequoia Compatibility](https://github.com/cypress-io/cypress/issues/30363)
