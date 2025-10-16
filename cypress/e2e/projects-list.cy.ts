describe('Projects List Page', () => {
  beforeEach(() => {
    cy.visitProjects();
  });

  it('should load the projects page successfully', () => {
    cy.url().should('include', '/projects');
  });

  it('should display a data table for projects', () => {
    // Check if table exists
    cy.get('table').should('exist').and('be.visible');
  });

  it('should display table headers', () => {
    // Check for table headers
    cy.get('thead').should('exist');
    cy.get('th').should('have.length.greaterThan', 0);
  });

  it('should display add project button', () => {
    // Look for the "Add New" button
    cy.contains('button', 'Add New').should('exist').and('be.visible');
  });

  it('should display filter input', () => {
    // Check if there's a filter input with placeholder
    cy.get('input[placeholder*="Filter"]').should('exist').and('be.visible');
  });

  it('should display column toggle button', () => {
    // Check for columns button
    cy.contains('button', 'Columns').should('exist').and('be.visible');
  });

  it('should display project rows or empty state', () => {
    // Check for either project rows or empty state message
    cy.get('table tbody').within(() => {
      cy.get('tr').should('have.length.greaterThan', 0);

      // Check content - either has data or shows empty message
      cy.get('tr').first().then(($row) => {
        const text = $row.text();
        // Should have either project data (multiple cells) or "No results." message
        expect(text.length).to.be.greaterThan(0);
      });
    });
  });

  it('should navigate back to dashboard from breadcrumb', () => {
    // Click on home link in breadcrumb using nav element
    cy.get('nav').within(() => {
      cy.contains('a', 'Home').click();
    });
    cy.url().should('not.include', '/projects');
  });

  it('should have sortable columns', () => {
    // Check for sort buttons in table headers
    cy.get('thead th button').should('exist');
  });

  it('should display pagination controls when there are projects', () => {
    // Check if pagination buttons exist
    cy.get('body').then(($body) => {
      const tableText = $body.find('table tbody').text();

      // Only check for pagination if we don't have empty state
      if (!tableText.includes('No results') && !tableText.includes('No Data')) {
        // Look for pagination buttons
        cy.get('button').filter(':contains("Page")').should('exist');
      }
    });
  });

  it('should allow typing in filter input', () => {
    cy.get('input[placeholder*="Filter"]').type('test').should('have.value', 'test');
  });
});
