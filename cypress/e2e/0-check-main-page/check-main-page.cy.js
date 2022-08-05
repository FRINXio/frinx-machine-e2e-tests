/// <reference types="cypress" />

describe('check main page of Frinx-machine', () => {
    beforeEach(() => {
        cy.visit('http://krakend.default.svc.cluster.local:80/')
//         cy.visit('http://krakend:80/')
    })

    it('Check title of the main page', () => {
        cy.title().should('eq', 'FRINX Dashboard')
    })

    // /* ==== Test Created with Cypress Studio ==== */
    // it('Install_devices', function() {
    //     /* ==== Generated with Cypress Studio ==== */
    //     cy.get('.css-1s9h98g > .chakra-stack > :nth-child(2) > .css-1t0mbvr > .chakra-button').click();
    //     cy.get('.css-79elbk > .chakra-input__group > .chakra-input').click();
    //     cy.get('.css-109qf7f > .css-0 > :nth-child(7)').click();
    //     cy.get(':nth-child(3) > .chakra-input__group > .chakra-input').clear();
    //     cy.get(':nth-child(3) > .chakra-input__group > .chakra-input').type('Install_device_by_name');
    //     cy.get(':nth-child(1) > .css-xumdn4 > .chakra-stack > .chakra-button__group > .css-1c2ov43').click();
    //     cy.get('#field-517').clear();
    //     cy.get('#field-517').type('IOS01');
    //     cy.get('.css-13x9wmi').click();
    //     cy.get('.chakra-modal__footer > .css-k008qs > .css-taj3dd').click();
    //     cy.get(':nth-child(2) > .css-xumdn4 > .chakra-stack > .chakra-button__group > .css-1c2ov43').click();
    //     cy.get('#field-176').clear();
    //     cy.get('#field-176').type('IOS01');
    //     cy.get('.css-13x9wmi').click();
    //     cy.get('.chakra-modal__footer > .css-k008qs > .css-taj3dd').click();
    //     /* ==== End Cypress Studio ==== */
    // });
})
