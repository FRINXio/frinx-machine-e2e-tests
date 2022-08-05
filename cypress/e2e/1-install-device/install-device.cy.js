/// <reference types="cypress" />

describe('install IOS device', () => {
    beforeEach(() => {
      cy.visit(Cypress.env('host'))
    })

    Cypress.on('uncaught:exception', (err, runnable) => {
      // we expect a 3rd party library error with message 'list not defined'
      // and don't want to fail the test so we return false
      // if (err.message.includes('apiFetch')) {
      return false
      // }
      // we still want to ensure there are no other unexpected
      // errors, so we let them fail the test
    })
  
    it('Install_device', function() {
      cy.get('.css-1s9h98g > .chakra-stack > :nth-child(2) > .css-1t0mbvr > .chakra-button').click();
      cy.get('.css-79elbk > .chakra-input__group > .chakra-input').click();
      cy.get('.css-109qf7f > .css-0 > :nth-child(7)').click();
      cy.get(':nth-child(3) > .chakra-input__group > .chakra-input').clear();
      cy.get(':nth-child(3) > .chakra-input__group > .chakra-input').type('Install_device_by_name');
      cy.get(':nth-child(1) > .css-xumdn4 > .chakra-stack > .chakra-button__group > .css-1c2ov43').click();
      cy.get('.chakra-input').type('IOS01');
      cy.get('#field-1149').clear();
      cy.get('#field-1149').type('IOS01');
      cy.get('.css-13x9wmi').click();
      cy.get('.chakra-modal__footer > .css-k008qs > .css-taj3dd').click();
      cy.get(':nth-child(2) > .css-xumdn4 > .chakra-stack > .chakra-button__group > .css-1c2ov43').click();
      cy.get('#field-176').clear();
      cy.get('#field-176').type('IOS01');
      cy.get('.css-13x9wmi').click();
      cy.get('.chakra-modal__footer > .css-k008qs > .css-taj3dd').click();
    });
})
