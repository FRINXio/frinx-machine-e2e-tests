/* global cy,it,describe,Cypress */

describe('Create workflow, test and delete it', () => {
  it('workflow builder', () => {
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'Create').click()
    cy.get('input[name="name"]').type('test workflow')
    cy.get('input[name="description"]').clear().type('test description')
    cy.get('input[placeholder="Add Labels (press Enter to add)"]').type('TEST{enter}')
    cy.contains('button', 'Save changes').click()
    cy.contains('button', 'Tasks').click()
    cy.contains('Install device by device name').parent().next().click()
    cy.get('button[title="zoom out"]').click().click().click()
    cy.get('div[data-id="start"').next().next().move({ deltaX: -50, deltaY: -100 })
    cy.get('button[aria-label="Remove edge"]').click()
    cy.get('div[data-id="start"').move({ deltaX: -100, deltaY: 0 })
    cy.get('div[data-id="end"').move({ deltaX: 100, deltaY: 0 })
    cy.get('div[data-nodeid="start"').click()
    cy.get('div[data-handlepos="left"').eq(1).click()
    cy.get('div[data-handlepos="right"').eq(1).click()
    cy.get('div[data-nodeid="end"').click()

    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save workflow').click()
    cy.contains('button', 'Close').click()
    cy.contains('Workflow Saved').should('be.visible')
  })

  it('save as', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save as').click()
    cy.get('input[placeholder="Please enter name of workflow"').type('test workflow copy')
    cy.contains('button', 'Cancel').next().click()
    cy.contains('Succesfully saved').should('be.visible')
  })

  it('show definition', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('Show definition').click()
    cy.get('.ace_content').should('contain', 'test workflow')
    cy.wait(2500)
    cy.get('button[aria-label="Close"').click()
  })

  function clickOnButtons () {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save workflow').click()
    cy.contains('button', 'Close').click()
    cy.contains('Workflow Saved').should('be.visible')
  }

  it('edit workflow', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('Edit workflow').click()
    cy.get('input[placeholder="Add Labels (press Enter to add)"]').type('TEST2{enter}')
    cy.contains('button', 'Save changes').click()
    clickOnButtons()
  })

  it('workflow editor', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Workflow editor').click()
    cy.get('.ace_content').type('{backspace}{backspace}{backspace}1{enter}{}}')
    cy.contains('button', 'Cancel').next().click()
    cy.wait(1000)
    clickOnButtons()
  })

  it.skip('search test', () => {
    cy.get('input[placeholder="Search tasks"]').type('INVENTORY_install_device_by_name')
    cy.get('input[placeholder="Search tasks"]').parent().next().should('contain', 'Install device by device name')
  })

  it.skip('workflow execution', () => {
    cy.contains('button', 'Save and execute').click()
    cy.get('input[name="device_name"]').type('SAOS6_2')
    cy.contains('button', 'Execute').click()
    cy.contains('Continue to detail').click()
    cy.wait(2000)
    cy.contains('COMPLETED').eq(0).should('be.visible')
  })

  it('save changes check', () => {
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'Explore').click()
    cy.get('input[placeholder="Search by keyword."]').type('test workflow')
    cy.contains('test workflow / 1').should('be.visible')
    cy.contains('test workflow copy / 1').should('be.visible')
    cy.contains('test description').should('be.visible')
    cy.contains('TEST').should('be.visible')
    cy.contains('TEST2').should('be.visible')
  })

  function deleteButton () {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Delete workflow').click()
    cy.wait(300)
    cy.contains('button', 'Delete').click()
  }

  it('workflow delete', () => {
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'Explore').click()
    cy.get('input[placeholder="Search by label."]').type('test')
    cy.contains('TEST').click()
    cy.get('a[href="/frinxui/uniflow/builder/test workflow/1"]').click()
    deleteButton()
    cy.get('input[placeholder="Search by keyword."]').type('test workflow')
    cy.get('a[href="/frinxui/uniflow/builder/test workflow copy/1"]').click()
    deleteButton()
    cy.wait(1000)
    cy.get('input[placeholder="Search by label."]').type('test workflow')
    cy.contains('test workflow / 1').should('not.exist')
    cy.contains('test workflow copy / 1').should('not.exist')
  })
})
