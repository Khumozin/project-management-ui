describe('Navigation', () => {
  it('should navigate to dashboard from root URL', () => {
    cy.visit('/');
    cy.skipSplashScreen();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should navigate to projects page', () => {
    cy.visit('/projects');
    cy.skipSplashScreen();
    cy.url().should('include', '/projects');
  });

  it('should navigate to projects using sidebar', () => {
    cy.visitDashboard();

    // Click on Travel project which links to /projects
    cy.contains('Travel').click();
    cy.url().should('include', '/projects');
  });

  it('should update breadcrumb when navigating', () => {
    cy.visitDashboard();
    cy.get('nav').should('exist');

    cy.visitProjects();
    cy.get('nav').should('contain', 'Projects');
  });

  it('should handle browser back and forward buttons', () => {
    cy.visitDashboard();
    cy.visitProjects();

    // Go back
    cy.go('back');
    cy.url().should('not.include', '/projects');

    // Go forward
    cy.go('forward');
    cy.url().should('include', '/projects');
  });

  it('should redirect unknown routes to dashboard', () => {
    cy.visit('/unknown-route-that-does-not-exist');
    cy.skipSplashScreen();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });

  it('should maintain theme preference during navigation', () => {
    cy.visitDashboard();

    // Open theme menu and select dark
    cy.get('[data-cy="theme-toggle"]').click();
    cy.contains('button', 'Dark').click();

    cy.wait(300);

    // Navigate to projects
    cy.visitProjects();

    // Verify theme persists
    cy.get('html').should('have.class', 'dark');
  });

  it('should display sidebar on all pages', () => {
    cy.visitDashboard();
    cy.get('hlm-sidebar').should('exist');

    cy.visitProjects();
    cy.get('hlm-sidebar').should('exist');
  });

  it('should display breadcrumb on all pages', () => {
    cy.visitDashboard();
    cy.get('nav').should('exist');

    cy.visitProjects();
    cy.get('nav').should('exist');
  });

  it('should be able to navigate home from breadcrumb', () => {
    cy.visitProjects();

    cy.get('nav').within(() => {
      cy.contains('a', 'Home').click();
    });

    cy.url().should('not.include', '/projects');
  });
});
