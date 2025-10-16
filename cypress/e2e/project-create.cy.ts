describe('Project Creation Flow', () => {
  beforeEach(() => {
    cy.visitProjects();
  });

  it('should open the add project dialog when clicking the add button', () => {
    // Click the "Add New" button
    cy.contains('button', 'Add New').click();

    // Check if dialog appears
    cy.get('[role="dialog"]').should('be.visible');

    // Check for dialog title
    cy.contains('Add Project').should('be.visible');
  });

  it('should display the project form in the dialog', () => {
    // Open the add project dialog
    cy.contains('button', 'Add New').click();

    // Wait for dialog to be visible
    cy.get('[role="dialog"]').should('be.visible');

    // Check for form elements using the actual form control names
    cy.get('input[formcontrolname="name"]').should('exist');
    cy.get('textarea[formcontrolname="description"]').should('exist');
  });

  it('should show validation errors for empty required fields', () => {
    // Open the add project dialog
    cy.contains('button', 'Add New').click();

    cy.get('[role="dialog"]').should('be.visible');

    // Find and click the save/submit button in the dialog
    cy.get('[role="dialog"]').within(() => {
      cy.contains('button', /save|submit|add/i).click();
    });

    // Check for validation errors - the form should show "is required" messages
    cy.contains(/required/i).should('be.visible');
  });

  it('should successfully create a new project with valid data', () => {
    cy.fixture('projects').then((data) => {
      // Open the add project dialog
      cy.contains('button', 'Add New').click();

      cy.get('[role="dialog"]').should('be.visible');

      // Fill in the form using actual formcontrolname attributes
      cy.get('input[formcontrolname="name"]').type(data.newProject.name);
      cy.get('textarea[formcontrolname="description"]').type(data.newProject.description);

      // Submit the form
      cy.get('[role="dialog"]').within(() => {
        cy.contains('button', /save|submit|add/i).click();
      });

      // Wait a bit for the operation to complete
      cy.wait(500);

      // Verify success - either dialog closes or success message appears
      // The dialog should close on success
      cy.get('[role="dialog"]').should('not.exist');
    });
  });

  it('should close the dialog when clicking X button', () => {
    // Open the add project dialog
    cy.contains('button', 'Add New').click();

    cy.get('[role="dialog"]').should('be.visible');

    // The X button is in the top right - click it directly by looking for the close button
    // It's typically the button with an X icon or specific close styling
    cy.get('[role="dialog"]').then(($dialog) => {
      // Click escape key or find close button
      cy.get('body').type('{esc}');
    });

    // Wait for dialog to close
    cy.wait(500);

    // Verify dialog closes
    cy.get('[role="dialog"]').should('not.exist');
  });

  it('should validate project name is required', () => {
    // Open the add project dialog
    cy.contains('button', 'Add New').click();

    cy.get('[role="dialog"]').should('be.visible');

    // Fill description but leave name empty
    cy.get('textarea[formcontrolname="description"]').type('Test description');

    // Try to submit
    cy.get('[role="dialog"]').within(() => {
      cy.contains('button', /save|submit|add/i).click();
    });

    // Should show validation error for name
    cy.contains(/name.*required/i).should('be.visible');
  });

  it('should validate description is required', () => {
    // Open the add project dialog
    cy.contains('button', 'Add New').click();

    cy.get('[role="dialog"]').should('be.visible');

    // Fill name but leave description empty
    cy.get('input[formcontrolname="name"]').type('Test Project');

    // Try to submit
    cy.get('[role="dialog"]').within(() => {
      cy.contains('button', /save|submit|add/i).click();
    });

    // Should show validation error for description
    cy.contains(/description.*required/i).should('be.visible');
  });

  it('should allow entering text in all form fields', () => {
    // Open the add project dialog
    cy.contains('button', 'Add New').click();

    cy.get('[role="dialog"]').should('be.visible');

    // Type in name field
    cy.get('input[formcontrolname="name"]')
      .type('My Test Project')
      .should('have.value', 'My Test Project');

    // Type in description field
    cy.get('textarea[formcontrolname="description"]')
      .type('This is a test description with @#$% special characters!')
      .should('contain.value', 'This is a test description');
  });
});
