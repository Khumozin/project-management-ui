describe('Theme Toggle Functionality', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it('should display the theme toggle button', () => {
    cy.get('[data-cy="theme-toggle"]').should('exist').and('be.visible');
  });

  it('should open theme menu when clicked', () => {
    cy.get('[data-cy="theme-toggle"]').click();

    // Menu should appear with theme options
    cy.contains('button', 'Light').should('be.visible');
    cy.contains('button', 'Dark').should('be.visible');
    cy.contains('button', 'System').should('be.visible');
  });

  it('should toggle to dark theme', () => {
    // Open theme menu
    cy.get('[data-cy="theme-toggle"]').click();

    // Select dark theme
    cy.contains('button', 'Dark').click();

    // Wait for theme to apply
    cy.wait(300);

    // Verify dark theme is applied
    cy.get('html').should('have.class', 'dark');
  });

  it('should toggle to light theme', () => {
    // First set to dark
    cy.get('[data-cy="theme-toggle"]').click();
    cy.contains('button', 'Dark').click();
    cy.wait(300);

    // Then back to light
    cy.get('[data-cy="theme-toggle"]').click();
    cy.contains('button', 'Light').click();
    cy.wait(300);

    // Verify light theme
    cy.get('html').should('not.have.class', 'dark');
  });

  it('should persist theme preference across page navigation', () => {
    // Set to dark theme
    cy.get('[data-cy="theme-toggle"]').click();
    cy.contains('button', 'Dark').click();
    cy.wait(300);

    // Navigate to projects page
    cy.visitProjects();

    // Verify dark theme persists
    cy.get('html').should('have.class', 'dark');

    // Navigate back to dashboard
    cy.visitDashboard();

    // Verify dark theme still persists
    cy.get('html').should('have.class', 'dark');
  });

  it('should persist theme preference after page reload', () => {
    // Set to dark theme
    cy.get('[data-cy="theme-toggle"]').click();
    cy.contains('button', 'Dark').click();
    cy.wait(300);

    // Reload the page
    cy.reload();
    cy.skipSplashScreen();

    // Verify dark theme persists after reload
    cy.get('html').should('have.class', 'dark');
  });

  it('should update the entire UI when theme changes', () => {
    // Toggle theme
    cy.get('[data-cy="theme-toggle"]').click();
    cy.contains('button', 'Dark').click();
    cy.wait(300);

    // Verify UI elements exist and are visible
    cy.get('body').should('be.visible');
    // Check sidebar exists (may be collapsed so just check existence)
    cy.get('hlm-sidebar').should('exist');
  });

  it('should have accessible theme toggle button', () => {
    // Check for aria-label
    cy.get('[data-cy="theme-toggle"]').should('have.attr', 'aria-label', 'Toggle theme');
  });

  it('should store theme preference in localStorage', () => {
    // Set to dark theme
    cy.get('[data-cy="theme-toggle"]').click();
    cy.contains('button', 'Dark').click();
    cy.wait(300);

    // Check localStorage
    cy.getAllLocalStorage().then((storage) => {
      const localStorage = storage[Cypress.config().baseUrl as string];
      expect(localStorage).to.exist;
      expect(localStorage['theme']).to.equal('dark');
    });
  });

  it('should support system theme option', () => {
    // Open theme menu
    cy.get('[data-cy="theme-toggle"]').click();

    // Select system theme
    cy.contains('button', 'System').click();
    cy.wait(300);

    // Check localStorage has system
    cy.getAllLocalStorage().then((storage) => {
      const localStorage = storage[Cypress.config().baseUrl as string];
      expect(localStorage['theme']).to.equal('system');
    });
  });
});
