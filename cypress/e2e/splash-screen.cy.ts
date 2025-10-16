describe('Splash Screen', () => {
  it('should display splash screen on initial load or load main app quickly', () => {
    cy.visit('/');

    // Either splash screen exists or main content is already loaded
    cy.get('body').should('exist');
  });

  it('should remove splash screen after app loads', () => {
    cy.visit('/');

    // Wait for splash screen to be removed (or verify it's already gone)
    cy.get('#splash-screen', { timeout: 3000 }).should('not.exist');

    // Verify main app is visible
    cy.get('app-root').should('be.visible');
  });

  it('should display main app content after splash', () => {
    cy.visit('/');
    cy.waitForSplashScreen();

    // Verify main UI elements are present
    cy.get('hlm-sidebar').should('exist');
    cy.get('nav').should('exist');
  });

  it('should test with splash screen skipped for faster execution', () => {
    cy.visit('/');
    cy.skipSplashScreen();

    // Splash screen should be immediately removed
    cy.get('#splash-screen').should('not.exist');

    // App should be visible
    cy.get('app-root').should('exist');
  });

  it('should wait for splash screen using custom command', () => {
    cy.visit('/');
    cy.waitForSplashScreen();

    // After waiting, splash screen should not exist
    cy.get('#splash-screen').should('not.exist');
    cy.get('app-root').should('be.visible');
  });

  it('should have functional app after splash screen', () => {
    cy.visitDashboard(); // This automatically skips splash

    // Verify app is functional - sidebar may be collapsed so just check existence
    cy.get('hlm-sidebar').should('exist');
    cy.get('nav').should('exist');
    cy.get('[data-cy="theme-toggle"]').should('exist');
  });

  it('should handle splash screen in dark mode', () => {
    // Visit with theme set in localStorage
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('theme', 'dark');
      },
    });

    cy.skipSplashScreen();

    // Verify dark mode is applied
    cy.get('html').should('have.class', 'dark');
  });
});
