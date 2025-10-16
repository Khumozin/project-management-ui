# Cypress E2E Test Improvements and Fixes

## Current Status

The Cypress e2e tests have been created but cannot be run on macOS 15.x (Sequoia) due to a known compatibility issue. This document outlines identified issues and recommended improvements for when the tests can be run.

## Identified Issues and Improvements Needed

### 1. Missing Data-Cy Attributes

The tests rely on generic selectors which may be fragile. Add `data-cy` attributes to key elements:

**Recommended additions:**

#### Sidebar Component
```typescript
// src/app/core/components/sidebar.ts
template: `
  <hlm-sidebar [collapsible]="'icon'" data-cy="sidebar">
    <!-- existing content -->
  </hlm-sidebar>
`
```

#### Breadcrumb Component
```typescript
// src/app/core/components/breadcrumb.ts
template: `
  <nav hlmBreadcrumb data-cy="breadcrumb">
    <!-- existing content -->
  </nav>
`
```

#### Theme Toggle Component
```typescript
// src/app/core/components/theme-toggle.ts
// Add data-cy="theme-toggle" to the button element
```

#### Projects List Component
```typescript
// src/app/features/projects/features/project-list.ts
// Add data-cy attributes to:
// - Add button: data-cy="add-project-button"
// - Table: data-cy="projects-table"
// - Search input: data-cy="search-input"
```

### 2. Test File Updates Needed

Once data-cy attributes are added, update test files to use them:

#### cypress/e2e/dashboard.cy.ts
```typescript
// Replace:
cy.get('[data-cy="sidebar"]').should('be.visible');
cy.get('[data-cy="breadcrumb"]').should('exist');
```

#### cypress/e2e/projects-list.cy.ts
```typescript
// Use specific data-cy selectors instead of generic ones
cy.get('[data-cy="add-project-button"]').should('exist');
cy.get('[data-cy="projects-table"]').should('exist');
```

### 3. Navigation Tests

The navigation tests may fail because:
- The sidebar items in `sidebar.ts` mostly have empty URLs (`url: ''`)
- Only the "Travel" project links to `/projects`
- Need to verify actual navigation links in the application

**Fix:** Update sidebar data or adjust tests to match actual routes.

### 4. Project Form Tests

The form tests make assumptions about field names. Need to verify:
- Actual form field names/IDs in the project form component
- Validation rules and error messages
- Submit button text

### 5. Theme Toggle Tests

The theme toggle tests assume the theme class is applied to the `<html>` element with class `dark`. Verify:
- How theme is actually applied in the app
- LocalStorage key name used for theme preference

## Recommended Test Execution Strategy

### Phase 1: Manual Verification (Current)
Use the manual testing checklist in `MACOS_15_ISSUE.md` to verify functionality

### Phase 2: CI/CD Integration (Recommended)
Set up GitHub Actions or similar CI to run tests in a Linux environment:

```yaml
# .github/workflows/e2e.yml
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
      - run: npm run build
      - run: npm start &
      - run: npx wait-on http://localhost:4200
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

### Phase 3: Fix and Re-run (When macOS issue resolved)
1. Install updated Cypress version with macOS 15 support
2. Add data-cy attributes to components
3. Update test selectors
4. Run tests and fix failures
5. Add more specific assertions

## Test Reliability Improvements

### Use More Specific Selectors
```typescript
// Instead of:
cy.contains('button', /add|new|create/i)

// Use:
cy.get('[data-cy="add-project-button"]')
```

### Add Explicit Waits
```typescript
// Wait for API calls to complete
cy.intercept('GET', '/api/projects').as('getProjects');
cy.visit('/projects');
cy.wait('@getProjects');
```

### Use Fixtures for API Mocking
```typescript
// Stub API responses for consistent test data
cy.intercept('GET', '/api/projects', { fixture: 'projects.json' }).as('getProjects');
```

### Test Data Cleanup
```typescript
// Add afterEach hooks to clean up test data
afterEach(() => {
  // Delete test projects created during tests
  cy.request('DELETE', '/api/projects/test-*');
});
```

## Next Steps

1. ✅ Create comprehensive test suite (Done)
2. ✅ Document macOS 15 issue (Done)
3. ⏳ Set up CI/CD pipeline for test execution
4. ⏳ Add data-cy attributes to components
5. ⏳ Wait for Cypress macOS 15 fix or switch to Playwright
6. ⏳ Run tests and fix failures
7. ⏳ Add API mocking with cy.intercept()
8. ⏳ Implement test data cleanup strategies

## Alternative: Playwright Migration

If Cypress continues to have issues on macOS 15, consider migrating to Playwright:

```bash
npm install --save-dev @playwright/test
npx playwright install
```

Playwright has better macOS 15 support and similar capabilities. The test structure would be similar:

```typescript
import { test, expect } from '@playwright/test';

test('dashboard loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-cy="sidebar"]')).toBeVisible();
});
```

## Summary

The e2e test infrastructure is in place and well-structured. The main blocker is the macOS 15 compatibility issue. Once tests can run (via CI/CD or after Cypress update), the main improvements needed are:

1. Add data-cy attributes for reliable selectors
2. Verify actual component structure matches test expectations
3. Add API mocking for consistent test data
4. Implement proper test cleanup

The tests are written following Cypress best practices and should work well once the platform issue is resolved.
