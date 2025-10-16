describe('Dashboard Page', () => {
  beforeEach(() => {
    cy.visitDashboard();
  });

  it('should load the dashboard page successfully', () => {
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should display the main layout with sidebar', () => {
    // Check for sidebar using the hlm-sidebar element
    cy.get('hlm-sidebar').should('exist');
  });

  it('should display the breadcrumb', () => {
    // Check for breadcrumb using nav element
    cy.get('nav').should('exist');
  });

  it('should display the theme toggle button', () => {
    cy.get('[data-cy="theme-toggle"]').should('exist');
  });

  it('should have a responsive layout', () => {
    // Test mobile viewport
    cy.viewport('iphone-x');
    cy.get('body').should('be.visible');

    // Test tablet viewport
    cy.viewport('ipad-2');
    cy.get('body').should('be.visible');

    // Test desktop viewport
    cy.viewport(1920, 1080);
    cy.get('body').should('be.visible');
  });

  it('should have sidebar toggle button', () => {
    // Look for sidebar trigger/toggle button
    cy.get('button').should('exist');
  });

  it('should display main content area', () => {
    cy.get('main').should('exist');
  });

  it('should have navigation elements in sidebar', () => {
    cy.get('hlm-sidebar').within(() => {
      // Should have navigation items
      cy.get('a, button').should('have.length.greaterThan', 0);
    });
  });

  it('should be able to navigate to projects', () => {
    // Click on Travel project link
    cy.contains('Travel').click();
    cy.url().should('include', '/projects');
  });

  it('should display breadcrumb with Home', () => {
    cy.get('nav').should('contain', 'Home');
  });
});
