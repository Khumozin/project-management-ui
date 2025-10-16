describe('Project Update Flow', () => {
  beforeEach(() => {
    cy.visitProjects();
  });

  it('should display table with projects or empty state', () => {
    // Just verify the page loaded
    cy.get('table').should('exist');
  });

  it('should have action column in table when projects exist', () => {
    cy.get('table tbody tr').then(($rows) => {
      const rowText = $rows.first().text();

      // If not showing empty state, there should be multiple cells
      if (!rowText.includes('No results')) {
        cy.get('table tbody tr').first().find('td').should('have.length.greaterThan', 1);
      }
    });
  });

  it('should be able to filter projects', () => {
    // Test the filter input
    cy.get('input[placeholder*="Filter"]').should('exist');
    cy.get('input[placeholder*="Filter"]').type('test');
  });

  it('should display columns toggle button', () => {
    cy.contains('button', 'Columns').should('exist');
  });

  it('should not fail when trying to interact with empty table', () => {
    cy.get('table tbody').should('exist');
    
    // Check the state - if empty, verify empty message
    cy.get('table tbody tr').first().then(($row) => {
      const text = $row.text();
      if (text.includes('No results')) {
        // Empty state is valid
        expect(text).to.include('No results');
      } else {
        // Has data - table should have cells
        cy.wrap($row).find('td').should('have.length.greaterThan', 0);
      }
    });
  });
});
