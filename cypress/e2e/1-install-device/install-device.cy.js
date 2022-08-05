/// <reference types="cypress" />

describe('install IOS device', () => {
    beforeEach(() => {
      cy.visit(Cypress.env('host'))
    })

    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  
    it('Install_device', function() {
      cy.get('a').eq(6).click();
      cy.findByPlaceholderText('Search by keyword.').type('Install_device_by_name');
      cy.get('button').eq(6).click();
      cy.findByPlaceholderText('Enter the input').type('IOS01');
      cy.get('button').eq(25).click();
      cy.findByText('Close').click();
      cy.findByText('Executed').click();
      cy.findAllByText('Install_device_by_name', { timeout: 100000 }).should('be.visible');
      cy.get('tbody').get('tr').eq(1).within(() => {
        cy.get('a').click();
      });
      cy.findAllByText('COMPLETED', { timeout: 1000000 }).should('be.visible');
    });
})
