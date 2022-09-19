describe('Create workflow, test and delete it', () => {
  it('workflow builder', () => {
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'Create').click()
    cy.get('input[name="name"]').type("test workflow")
    cy.get('input[name="description"]').clear().type("test description")
    cy.get('input[placeholder="Add Labels (press Enter to add)"]').type('TEST{enter}')
    cy.contains('button', 'Save changes').click()
    cy.contains('button', 'Tasks').click()
    cy.contains('Install device by device name').parent().next().click()
    cy.get('button[title="zoom out"]').click().click().click()
    cy.get('.css-11s7zks').move({ deltaX: -50, deltaY: -100 })
    cy.get('.css-1brz29g > .chakra-button').click()
    cy.get('.css-1jw6u1z').move({ deltaX: -100, deltaY: 0 })
    cy.get('.css-hm524w').move({ deltaX: 100, deltaY: 0 })
    cy.get('.css-1nv0ef9 > .react-flow__handle').drag('.css-1rio1b9 > .react-flow__handle')
    cy.get('.css-78v3ur > .react-flow__handle').drag('.css-8lv4b > .react-flow__handle')
    
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save workflow').click()
    cy.contains('button', 'Close').click()
    cy.get('.css-1lxk9pq').should('contain', 'Workflow Saved')
  })

  it('save as', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save as').click()
    cy.get('input[placeholder="Please enter name of workflow"').type('test workflow copy')
    cy.get('.css-1hlhk5j').click()
    cy.get('#toast-1-title').should('contain', 'Succesfully') 
  })
    
  it('show definition', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('Show definition').click()
    cy.get('.ace_content').should('contain', 'test workflow')
    cy.wait(300)
    cy.get('.chakra-modal__close-btn').click()
  })
  
  it('edit workflow', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('Edit workflow').click()
    cy.get('input[placeholder="Add Labels (press Enter to add)"]').type('TEST2{enter}')
    cy.contains('button', 'Save changes').click()
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save workflow').click()
    cy.contains('button', 'Close').click()
    cy.get('.css-1lxk9pq').should('contain', 'Workflow Saved')
  })

  it('workflow editor', () => {
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Workflow editor').click()
    cy.get('.ace_content').type('{backspace}{backspace}{backspace}1{enter}{}}')
    cy.get('.chakra-modal__footer > .css-8pcd7y').click()
    cy.contains('button', 'Actions').click()
    cy.contains('button', 'Save workflow').click()
    cy.get('.chakra-stack > .css-taj3dd').click()
    cy.get('.css-1lxk9pq').should('contain', 'Workflow Saved')
  })

  it('search test', () => {
    cy.get('input[placeholder="Search tasks"]').type('INVENTORY_install_device_by_name')
    cy.get(':nth-child(2) > .css-sglica > .chakra-heading > .css-0').should('contain','INVENTORY_install_device_by_name')
  })

  it('workflow execution', () => {
    cy.contains('button', 'Save and execute').click()
    cy.get('input[name="device_name"]').type('SAOS6_2')
    cy.contains('button', 'Execute').click()
    cy.contains('Continue to detail').click()
    cy.get('.css-12dmjen').should('contain', 'COMPLETED')
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
  
  it('workflow delete', () => {
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'Explore').click()
    cy.get('input[placeholder="Search by keyword."]').type('test workflow')
    cy.get(':nth-child(1) > :nth-child(4) > .chakra-stack > .chakra-button__group > .css-1c0cdvt').click()
    cy.contains('button', 'Delete').click()
    cy.wait(300)
    cy.get('.css-1c0cdvt').click()
    cy.contains('button', 'Delete').click()
  })
  
})