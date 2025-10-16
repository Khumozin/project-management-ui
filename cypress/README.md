# Cypress E2E Tests

This directory contains end-to-end tests for the Project Management UI application using Cypress.

## Test Structure

```
cypress/
├── e2e/                    # Test files
│   ├── dashboard.cy.ts     # Dashboard page tests
│   ├── navigation.cy.ts    # Navigation tests
│   ├── project-create.cy.ts # Project creation flow tests
│   ├── project-update.cy.ts # Project update flow tests
│   ├── projects-list.cy.ts  # Projects list page tests
│   ├── splash-screen.cy.ts  # Splash screen tests
│   └── theme-toggle.cy.ts   # Theme toggle functionality tests
├── fixtures/               # Test data
│   └── projects.json       # Sample project data
├── support/                # Support files
│   ├── commands.ts         # Custom Cypress commands
│   └── e2e.ts              # Global configuration
└── README.md               # This file
```

## Running Tests

> **⚠️ macOS 15 (Sequoia) Compatibility Issue**: Cypress currently has a known compatibility issue with macOS 15.x. If you're on macOS 15, see [MACOS_15_ISSUE.md](MACOS_15_ISSUE.md) for workarounds and alternatives. The tests work fine on macOS 14 and earlier, Linux, Windows, and in CI/CD environments.

### Interactive Mode (Cypress Test Runner)
```bash
npm run e2e
```
This opens the Cypress Test Runner UI where you can select and run individual tests.

### Headless Mode
```bash
npm run e2e:headless
```
Runs all tests in headless mode (no GUI).

### CI Mode
```bash
npm run e2e:ci
```
Starts the development server, waits for it to be ready, then runs all tests in headless mode.

### Docker (Recommended for macOS 15)
```bash
docker run -it -v $PWD:/e2e -w /e2e cypress/included:13.15.2
```

## Custom Commands

The following custom commands are available in all tests:

- `cy.visitDashboard()` - Navigate to the dashboard page, skip splash screen, and wait for Angular to be ready
- `cy.visitProjects()` - Navigate to the projects page, skip splash screen, and wait for Angular to be ready
- `cy.waitForAngular()` - Wait for Angular to stabilize after navigation
- `cy.skipSplashScreen()` - Immediately remove the splash screen for faster test execution
- `cy.waitForSplashScreen()` - Wait for the splash screen to disappear naturally (up to 2 seconds)

### Handling the Splash Screen

The application displays a splash screen for a minimum of 1 second on initial load. This can slow down e2e tests. The custom commands `cy.visitDashboard()` and `cy.visitProjects()` automatically skip the splash screen for faster test execution.

**To skip the splash screen manually:**
```typescript
cy.visit('/');
cy.skipSplashScreen(); // Immediately removes splash screen
```

**To wait for the splash screen naturally:**
```typescript
cy.visit('/');
cy.waitForSplashScreen(); // Waits up to 2 seconds for splash to disappear
```

**To test the splash screen itself:**
See `cypress/e2e/splash-screen.cy.ts` for examples of testing the splash screen functionality.

## Test Coverage

### Dashboard Tests
- Page loads successfully
- Main layout and sidebar display
- Navigation menu exists
- Breadcrumb navigation works
- Responsive layout on different viewports
- Navigation to other pages

### Projects List Tests
- Page loads successfully
- Data table displays
- Table headers and columns render
- Add project button exists
- Search/filter functionality
- Action buttons (edit, delete) available
- Empty state handling
- Sortable columns
- Pagination (when applicable)

### Project Creation Tests
- Add dialog opens
- Form displays correctly
- Validation for required fields
- Successful project creation
- Cancel functionality
- Dialog close behavior
- Field validation (length, special characters)

### Project Update Tests
- Edit dialog opens from action menu
- Form pre-populates with existing data
- Successful project update
- Validation when clearing required fields
- Cancel without saving changes

### Theme Toggle Tests
- Theme toggle button displays
- Switching between light and dark themes
- Theme persistence across navigation
- Theme persistence after page reload
- Multiple theme toggles work correctly
- Accessibility of theme toggle
- Theme stored in localStorage

### Navigation Tests
- Dashboard navigation
- Projects page navigation
- Navigation menu functionality
- Breadcrumb updates
- Browser back/forward buttons
- Unknown route redirects
- Theme persistence during navigation
- Sidebar displays on all pages
- Active navigation item highlighting

### Splash Screen Tests
- Splash screen displays on initial load
- Splash screen elements render correctly
- Splash screen is removed after app loads
- Splash screen styling is correct
- Splash screen works in dark mode
- Skip splash screen command works
- Wait for splash screen command works

## Writing New Tests

1. Create a new file in `cypress/e2e/` with the `.cy.ts` extension
2. Use the `describe()` block to group related tests
3. Use `beforeEach()` to set up common preconditions
4. Use `it()` blocks for individual test cases
5. Leverage custom commands from `cypress/support/commands.ts`

Example:
```typescript
describe('Feature Name', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it('should do something', () => {
    cy.get('selector').should('be.visible');
  });
});
```

## Best Practices

1. Use data-cy attributes for selecting elements when possible
2. Avoid relying on implementation details (class names, IDs)
3. Write independent tests that can run in any order
4. Use fixtures for test data
5. Clean up after tests (if creating data)
6. Use meaningful test descriptions
7. Keep tests focused and simple
8. Use custom commands to reduce duplication

## Configuration

Cypress configuration is in `cypress.config.ts` at the project root.

Key settings:
- Base URL: http://localhost:4200
- Viewport: 1280x720
- Videos: Saved to `cypress/videos/`
- Screenshots: Saved to `cypress/screenshots/`

## Troubleshooting

### Tests fail with timeout errors
- Ensure the dev server is running (`npm start`)
- Increase timeout values in the test if needed
- Check if the application is accessible at http://localhost:4200

### Element not found errors
- Verify selectors match the actual DOM
- Add wait conditions if elements load asynchronously
- Use `cy.waitForAngular()` after navigation
- If splash screen is blocking elements, use `cy.skipSplashScreen()` or `cy.waitForSplashScreen()`

### Splash screen interfering with tests
- The `cy.visitDashboard()` and `cy.visitProjects()` commands automatically skip the splash screen
- If using `cy.visit()` directly, call `cy.skipSplashScreen()` immediately after
- For testing the splash screen itself, use `cy.waitForSplashScreen()` to wait for it to disappear naturally

### Tests pass locally but fail in CI
- Ensure `npm run e2e:ci` works locally
- Check viewport settings
- Verify test data setup

## Known Issues

### macOS 15 (Sequoia) Compatibility
Cypress has a compatibility issue with macOS 15.x. See [MACOS_15_ISSUE.md](MACOS_15_ISSUE.md) for:
- Detailed problem description
- Workarounds (Docker, CI/CD, different OS)
- Manual testing checklist
- CI/CD integration example

### Test Improvements
See [TEST_IMPROVEMENTS.md](TEST_IMPROVEMENTS.md) for:
- Recommended data-cy attribute additions
- Test reliability improvements
- API mocking strategies
- Migration path to Playwright if needed

## Resources

- [Cypress Documentation](https://docs.cypress.io/)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Angular + Cypress](https://docs.cypress.io/guides/component-testing/angular/overview)
- [macOS 15 Issue Tracker](https://github.com/cypress-io/cypress/issues/30363)
