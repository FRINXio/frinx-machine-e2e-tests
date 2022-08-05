/// <reference types="cypress" />

describe('check main page of Frinx-machine', () => {
    beforeEach(() => {
        cy.visit('http://krakend.default.svc.cluster.local:80/')
    })

    it('Check title of the main page', () => {
        cy.title().should('eq', 'FRINX Dashboard')
    })

})
