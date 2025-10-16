/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to visit the dashboard
       * @example cy.visitDashboard()
       */
      visitDashboard(): Chainable<void>;

      /**
       * Custom command to visit the projects page
       * @example cy.visitProjects()
       */
      visitProjects(): Chainable<void>;

      /**
       * Custom command to wait for Angular to be ready
       * @example cy.waitForAngular()
       */
      waitForAngular(): Chainable<void>;

      /**
       * Custom command to wait for the splash screen to disappear
       * @example cy.waitForSplashScreen()
       */
      waitForSplashScreen(): Chainable<void>;

      /**
       * Custom command to skip the splash screen for faster tests
       * @example cy.skipSplashScreen()
       */
      skipSplashScreen(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('waitForSplashScreen', () => {
  // Wait for splash screen to be removed from DOM
  cy.get('#splash-screen', { timeout: 2000 }).should('not.exist');
});

Cypress.Commands.add('skipSplashScreen', () => {
  // Immediately remove splash screen if it exists
  cy.get('body').then(($body) => {
    const splashScreen = $body.find('#splash-screen');
    if (splashScreen.length > 0) {
      cy.get('#splash-screen').invoke('remove');
    }
  });
});

Cypress.Commands.add('visitDashboard', () => {
  cy.visit('/');
  cy.skipSplashScreen(); // Skip splash screen for faster tests
  cy.waitForAngular();
});

Cypress.Commands.add('visitProjects', () => {
  cy.visit('/projects');
  cy.skipSplashScreen(); // Skip splash screen for faster tests
  cy.waitForAngular();
});

Cypress.Commands.add('waitForAngular', () => {
  // Wait for Angular to stabilize
  cy.window().should('have.property', 'ng');
  cy.wait(100); // Small buffer for Angular to complete rendering
});

export {};
