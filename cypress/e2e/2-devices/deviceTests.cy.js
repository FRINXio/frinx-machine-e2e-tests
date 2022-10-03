/* global cy,it,describe,Cypress */

describe('master test for checking multiple device inventory settings', () => {
  const deviceInventoryUrl = Cypress.env('host') + '/frinxui/inventory/devices'

  it('should visit the main and device page', () => {
    cy.visit(Cypress.env('host'))
    cy.get("a[href='/frinxui/inventory']").contains('Explore').click()
    cy.visit(Cypress.env('host'))
    cy.get("button[aria-haspopup='menu']").click()
    cy.wait(500)
    cy.get("a[data-index='2']").click()
  })

  it('should find device by name and install afterwards', () => {
    cy.wait(500)
    cy.get("input[placeholder='Start typing...']").click()
    cy.contains('IOS').click()
    cy.get('button').contains('Search').click()
    cy.wait(500)
    cy.get("span[aria-hidden='true'").eq(1).click()
    cy.contains('Install selected').click()
    cy.get('button').contains('Install selected').should('be.visible')
    cy.contains('Installed', { timeout: 80000 })
    cy.wait(1000)
    cy.get("span[aria-hidden='true'").eq(1).should('have.attr', 'data-disabled')
    cy.get("button[aria-label='Delete device'").eq(0).should('have.attr', 'disabled')
    cy.wait(500)
    cy.get("a[aria-label='config'").eq(0).click()
    cy.contains('Config data store').should('be.visible')
  })

  it('should search device by label and install it afterwards', () => {
    cy.visit(deviceInventoryUrl)
    cy.get("input[placeholder='Search device']").type('IOS01')
    cy.get('button').contains('Search').click()
    cy.wait(500)
    cy.get('button').contains('Install').click()
    cy.contains('Installed', { timeout: 30000 })
  })

  it('should uninstall installed devices', () => {
    cy.visit(deviceInventoryUrl)
    cy.wait(500)
    cy.get('.css-1urtp3g').click({ multiple: true })
    cy.contains('Installed').should('not.exist', { timeout: 10000 })
  })
  it('should check if added labe/name can be removed', () => {
    cy.contains('Filter by labels').click()
    cy.contains('XR').click()
    cy.get("Label[for='device-search']").click()
    cy.get("input[placeholder='Start typing...']").click()
    cy.contains('XR').click()
    cy.get("input[placeholder='Search device']").type('XR01')
    cy.get('button').contains('Search').click()
    cy.wait(1000)
    cy.get("input[value='XR01']").clear()
    cy.get("path[fill='currentColor']").click()
    cy.get('button').contains('Search').click()
    cy.wait(500)
  })

  it('should edit chosen device', () => {
    cy.get("a[aria-label='edit']").eq(0).click()
    cy.get("select[name='serviceState']").select('In Service')
    cy.get("input[placeholder='Enter vendor of the device']").type('NOKIA')
    cy.get("input[placeholder='Enter model of the device']").type('CRI-24-Y8')
    cy.get("input[placeholder='Enter address of the device']").type('192.168.01.17')
    cy.get("input[aria-autocomplete='list']").type('EXAMPLE')
    cy.contains('EXAMPLE').should('be.visible').click()
    cy.get('button').contains('Save changes').click()
  })

  it.skip('should check edited device', () => {
    cy.visit(Cypress.env('deviceInventory'))
    cy.get("a[aria-label='edit']").eq(0).click()
    cy.wait(1000)
    cy.contains('In Service').should('be.visible')
    cy.contains('NOKIA').should('be.visible')
    cy.contains('CRI-24-Y8').should('be.visible')
    cy.contains('192.168.01.17').should('be.visible')
    cy.contains('EXAMPLE').should('be.visible')
  })

  it.skip('should delete specific device', () => {
    cy.get("input[placeholder='Search device']").type('SAOS8_1')
    cy.get('button').contains('Search').click()
    cy.wait(500)
    cy.get("button[aria-label='Delete device']").click()
    cy.get('button').contains('Cancel').click()
    cy.get("button[aria-label='Delete device']").click()
    cy.get('footer').contains('Delete').click()
    cy.visit(deviceInventoryUrl)
    cy.wait(500)
    cy.contains('SAOS8_1').should('not.exist')
  })

  it.skip('should add device without blueprint - frontend 1.0.19', () => {
    const textParameters = '{"cli":{"cli-topology:host":"sample-topology","cli-topology:port":"10003","cli-topology:password":"frinx","cli-topology:username":"frinx","cli-topology:device-type":"saos","cli-topology:journal-size":500,"cli-topology:device-version":"8","cli-topology:parsing-engine":"one-line-parser","cli-topology:transport-type":"ssh","cli-topology:dry-run-journal-size":180}}'
    cy.visit(deviceInventoryUrl)
    cy.wait(1000)
    cy.get('a').contains('Add device').click()
    cy.get("input[placeholder='R1']").type('R1')
    cy.get("select[name='zoneId']").select('uniconfig')
    cy.get("select[name='serviceState']").select('In Service')
    cy.get("input[name='vendor']").type('Huawei')
    cy.get("input[name='model']").type('CR2-15P')
    cy.get("input[name='deviceType']").type('IOSXR')
    cy.get("input[name='version']").type('5.2')
    cy.get("input[name='username']").type('cisco123')
    cy.get("input[name='password']").type('cisco123')
    cy.get("input[name='address']").type('192.168.0.1')
    cy.get("input[name='port']").type('{backspace}15')
    cy.get("input[placeholder='Start typing...']").type('CLI')
    cy.contains('CLI').click()
    cy.get("textarea[spellcheck='false']").type('{backspace}{backspace}')
    cy.get("textarea[wrap='off']").type(textParameters, { parseSpecialCharSequences: false })
    cy.get("button[type='submit']").click()
    cy.contains('Import from CSV').should('be.visible')
  })

  it.skip('should remove example_device with delete selected button', () => {
    cy.visit(deviceInventoryUrl)
    cy.get("input[placeholder='Search device']").type('Example_SAOS_device')
    cy.get('button').contains('Search').click()
    cy.wait(500)
    cy.get("span[aria-hidden='true'").eq(1).click()
    cy.get('button').contains('Delete selected').click()
    cy.get('button').contains('Cancel').click()
    cy.wait(500)
    cy.get('button').contains('Delete selected').click()
    cy.wait(500)
    cy.get('footer').contains('Delete').click()
    cy.visit(deviceInventoryUrl)
    cy.wait(500)
    cy.contains('Example_SAOS_device').should('not.exist')
  })

  it.skip('should add SAOS8_1 with blueprint', () => {
    cy.visit(deviceInventoryUrl)
    cy.wait(1000)
    cy.get('a').contains('Add device').click()
    cy.get("input[name='name']").type('SAOS8_1')
    cy.get("select[name='zone']").select('uniconfig')
    cy.get("select[name='serviceState']").select('In Service')
    cy.get("span[aria-hidden='true'").eq(2).click()
    cy.get('select').eq(2).select('cli_saos_device')
    cy.get("input[type='text']").eq(0).type('one-line-parser')
    cy.get("input[type='text']").eq(1).type('frinx')
    cy.get("input[type='text']").eq(2).type('frinx')
    cy.get("input[type='text']").eq(3).type('8')
    cy.get("input[type='text']").eq(4).type('saos')
    cy.get("input[type='text']").eq(5).type('10000')
    cy.get('button').contains('Save variables').click()
    cy.wait(1000)
    cy.get('button').contains('Add device').click()
  })

  it('should handle adding and using blueprint', () => {
    cy.visit(deviceInventoryUrl)
    cy.contains('Blueprints').click()
    cy.wait(1000)
    cy.get('a').contains('Add blueprint').click()
    cy.get('input').eq(0).type('Example_Blueprint')
    cy.get('textarea').type('Example_Content')
    cy.get('button').contains('Add blueprint').click()
    cy.wait(500)
    cy.contains('Example_Blueprint')
    cy.visit(deviceInventoryUrl)
    cy.wait(1000)
    cy.get('a').contains('Add device').click()
    cy.get("span[aria-hidden='true'").eq(2).click()
    cy.get('select').eq(2).select('Example_Blueprint')
    cy.visit(deviceInventoryUrl)
    cy.contains('Blueprints').click()
    cy.get("button[aria-label='Delete blueprint']").eq(4).click()
  })

  it('should check transactions and config change in Leaf01', () => {
    cy.visit(deviceInventoryUrl)
    cy.get("input[placeholder='Search device']").type('Leaf01')
    cy.get('button').contains('Search').click()
    cy.wait(500)
    cy.get('button').contains('Install').click()
    cy.contains('Installed', { timeout: 200000 }).should('be.visible')
    cy.get("a[aria-label='config']").click()
    cy.wait(1000)
    cy.get('button').contains('Sync from network').click()
    cy.contains('Sync from network', { timeout: 100000 })
    cy.wait(500)
    cy.get('span').contains('Loopback0').first().click({ force: true })
    cy.get("textarea[spellcheck='false']").eq(0).type('{backspace}999')
    cy.get('button').contains('Save').click()
    cy.contains('Success', { timeout: 1000 }).should('be.visible')
    cy.get('button').contains('Dry run').click()
    cy.contains('Dry run commit output', { timeout: 100000 })
    cy.get('button').contains('Close').click()
    cy.get('button').contains('Calculate diff').click()
    cy.contains('Calculated diff output', { timeout: 100000 })
    cy.get('button').contains('Close').click()
    cy.get('button').contains('Commit to network').click()
    cy.wait(1000)
    cy.contains('Successfully comm', { timeout: 15000 })
    cy.get('button').contains('Sync from network').click()
    cy.contains('Successfully synced from network', { timeout: 100000 })
    cy.get('a').contains('Transactions').click()
    cy.get("button[aria-label='Revert'").eq(0).click()
    cy.wait(1000)
    cy.get('button').contains('Revert changes').click()
    cy.contains('reverted', { timeout: 100000 })
    cy.wait(1000)
    cy.get('a').contains('Leaf01').eq(0).click()
    cy.contains('999').should('not.exist')
  })
})