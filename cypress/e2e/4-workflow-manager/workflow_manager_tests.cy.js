/* global cy,it,describe,beforeEach,Cypress */

import { recurse } from 'cypress-recurse'

describe('master test for checking workflow manager features', () => {
  beforeEach(() => {
    cy.visit(Cypress.env('host'))
  })

  it('workflow page', () => {
    // Check workflow manager access by menulist
    cy.xpath('/html/body/div[1]/div[1]/div[1]/button').click()
    cy.get('a[data-index="1"').click()
    // test
    cy.get('h1').should('include.text', 'Workflows')

    // Check workflow manager access by dashboard link
    cy.visit(Cypress.env('host'))
    cy.contains('a', 'WorkFlow Manager').click()
    // test
    cy.get('h1').should('include.text', 'Workflows')
  })

  it('filter by label', () => {
    cy.get('[href=\'/frinxui/workflow-manager/definitions\']').click()
    cy.url().should('include', 'definitions')

    cy.get('input[placeholder=\'Search by label.\'').type('CLI{enter}')
    cy.wait(300)

    // test
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(6)
      })

    // delete
    cy.contains('p', 'CLI').click()

    cy.get('input[placeholder=\'Search by label.\'').type('BASICS{enter}')
    // test
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(10)
      })

    cy.contains('button', 'Next').click()
    cy.wait(300)
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(3)
      })

    // delete
    cy.contains('p', 'BASICS').click()

    // set 2 unlogical labels
    // manually doesn't work properly - it's hard to reproduce by physically typing
    cy.get('input[placeholder=\'Search by label.\'').type('CLI{enter}').type('L2VPN{enter}')
    cy.wait(300)
    // test
    cy.get('tbody tr').should(($tr) => {
      expect($tr).to.have.length(0)
    })

    cy.get('button[aria-label=\'Clear\']').click()
    // pseudo test
    cy.contains('button', '3').click()
  })

  it('filter by keyword', () => {
    cy.get('[href=\'/frinxui/workflow-manager/definitions\']').click()
    cy.url().should('include', 'definitions')
    cy.get('input[placeholder=\'Search by keyword.\'').type('Create_loopback')
    cy.wait(300)
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(2)
      })
    cy.get('input[placeholder=\'Search by keyword.\'').type('_all')
    cy.wait(300)
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(1)
      })
    cy.get('input[placeholder="Search by keyword."').clear()
    cy.wait(300)
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(10)
      })
  })

  it('wf uninstall all devices', () => {
    cy.xpath('/html/body/div[1]/div[1]/div[1]/button').click()
    cy.get('a[data-index=\'1\'').click()
    cy.url().should('include', 'definitions')
    cy.get('input[placeholder=\'Search by keyword.\'').type('Uninstall_all_from_inventory')
    cy.wait(300)
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(1)
      })
    cy.xpath('/html/body/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[4]/div/div/button[2]').click()
    cy.get('input[placeholder=\'Enter the input\']').type('CREATE_LOOPBACK_DEMO')
    cy.contains('button', 'Execute').click()
    cy.contains('a', '-', { timeout: 10000 }).click()

    // test
    cy.contains('div', 'Status', { timeout: 1200000 }).should('contain', 'COMPLETED')
  })

  it('wf install specific device by name', () => {
    cy.visit(`${Cypress.env('host')}frinxui/workflow-manager/definitions`)
    cy.get('input[placeholder=\'Search by keyword.\'').type('Install_device_by_')
    cy.wait(300)
    cy.xpath('/html/body/div[1]/div[2]/div[2]/table/tbody/tr[2]/td[4]/div/div/button[2]').click()
    cy.get('input[placeholder=\'Enter the input\']').type('XR01')
    cy.contains('button', 'Execute').click()
    cy.contains('a', '-', { timeout: 10000 }).click()
    cy.contains('div', 'Status', { timeout: 1200000 }).should('contain', 'COMPLETED')
  })

  it('try add wf to favourite', () => {
    cy.get('[href=\'/frinxui/workflow-manager/definitions\']').click()
    cy.wait(500)
    cy.get('button[aria-haspopup=\'menu\']').eq(2).click()
    cy.contains('button', 'Add to favourites').click()
    cy.get('button[title=\'Favourites\']').click()
    cy.wait(500)
    // test
    cy.get('tbody').find('tr')
      .then((row) => {
        expect(row.length).eq(1)
      })
    cy.get('button[aria-haspopup=\'menu\']').eq(2).click()
    cy.contains('button', 'Remove from favourites').click()
  })

  it.skip('try add wf to scheduled', () => {
    cy.get('[href=\'/frinxui/workflow-manager/definitions\']').click()
    cy.get('input[placeholder=\'Search by keyword.\'').type('Create_loopback_')
    cy.get('button[aria-haspopup=\'menu\']').eq(2).click()
    cy.contains('button', 'Create schedule').click()

    // generate cron tab value -> +2 min from now
    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate()
    const hour = now.getHours()
    const minute = now.getMinutes() + 1
    const crontabValue = minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + '*'

    cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[1]/input').clear().type(crontabValue)
    cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[2]/label/span[1]').click()

    const wfContent = '{"input":{"labels":"CREATE_LOOPBACK_DEMO"},"scheduleName":"frinx___Create_loopback_all_in_uniconfig:1","labels":"CREATE_LOOPBACK_DEMO","loopback_id":"789"}}'

    cy.get('.ace_content').type('{backspace}{backspace}')
    cy.get('.ace_content').type(wfContent, { parseSpecialCharSequences: false })
    cy.xpath('/html/body/div[4]/div[4]/div/section/footer/div/button[1]').click()
    cy.get('[href=\'/frinxui/workflow-manager/scheduled\']').click()
    cy.wait(300)

    // test
    cy.get('tbody', { timeout: 2500 }).find('tr')
      .then((row) => {
        expect(row.length).eq(1)
      })
    cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr/td[5]/div/div/button[2]').click()

    // test
    cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[1]/input')
      .invoke('val')
      .then((crontabValue2) => {
        cy.log(crontabValue2)
        expect(crontabValue2).eq(wfContent)
      })

    // test
    cy.get('.chakra-checkbox__control').should('have.attr', 'data-checked')

    // test
    cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[3]/div/div[2]/div/div[3]/div[6]/div/span[2]')
      .invoke('text')
      .then((loopbackId) => {
        expect(loopbackId).eq('"789"')
      })

    recurse(
      function () {
        return cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[3]').invoke('text')
      },
      function (s) {
        return s === 'RUNNING'
      },
      {
        limit: 250,
        delay: 500,
        timeout: 60_000,
        log: false,
        reduceFrom: [],
        reduce (textArr, s) {
          textArr.push(s)
        },
        post () {
          cy.reload()
        },
        yield: 'reduced'
      }
    ).then(function (textArr) {
      expect(textArr).to.not.include('RUNNING')
    })

    recurse(
      function () {
        return cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[3]').invoke('text')
      },
      function (s) {
        return s === 'COMPLETED'
      },
      {
        limit: 600,
        delay: 500,
        timeout: 300_000,
        log: false,
        reduceFrom: [],
        reduce (textArr, s) {
          textArr.push(s)
        },
        post () {
          cy.reload()
        },
        yield: 'reduced'
      }
    ).then(function (textArr) {
      expect(textArr).to.not.include('COMPLETED')
    })
    cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr/td[5]/div/div/button[1]/span').click()
    cy.xpath('/html/body/div[1]/div[2]/div/div').should('contain', 'There are no scheduled workflows yet')
  })

  it('try create wf', () => {
    cy.xpath('/html/body/div[1]/div[1]/div[1]/button').click()
    cy.get('a[data-index=\'1\'').click()
    cy.url().should('include', 'definitions')
    cy.xpath('/html/body/div[1]/div[2]/div[1]/header/div/div/a').click()
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[1]/input').type('test_name_001')
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[2]/input').type('{backspace}{backspace}')
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[2]/input').type('{{}')
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[2]/input').type('test_description')
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[2]/input').type('{}}')
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[3]/div/input').type('test_label')
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[6]/div/div/input').type('qwertz')
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[6]/div/div/button').click()
    cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[8]/button').click()
    cy.url().should('include', 'builder')
    cy.get('[href=\'/frinxui/workflow-manager/definitions\']').click()
    cy.get('input[placeholder=\'Search by keyword.\'').type('test_name_001')
    // test
    cy.get('tbody tr').should(($tr) => {
      expect($tr).to.have.length(0)
    })
  })
})