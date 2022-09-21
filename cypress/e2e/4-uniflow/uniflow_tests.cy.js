import { recurse } from 'cypress-recurse';

describe('master test for checking UniFlow features', () => {
	beforeEach(() => {
		cy.visit(Cypress.env('host'))
	})

	it('workflow page', () => {
		cy.get('button[class="chakra-button chakra-menu__menu-button css-1unm9xp"]').click()
		cy.get('p[class="chakra-text css-722v25"]').eq(1).click()
		cy.get('h1').should('include.text', 'Workflows')
		cy.visit(Cypress.env('host'))
		cy.contains('a', 'UniFlow').click()
		cy.get('h1').should('include.text', 'Workflows')
	})
	
	it('filter by label', () => {
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.url().should('include', 'definitions')
		cy.get('input[placeholder="Search by label."').type('CLI{enter}')
		cy.wait(300)
		cy.get('tbody').find("tr")
			.then((row) => {
				expect(row.length).eq(6)
			})

		cy.contains('p', 'CLI').click()
		cy.get('input[placeholder="Search by label."').type('BASICS{enter}')
		cy.get('tbody').find("tr")
			.then((row) => {
				expect(row.length).eq(10)
			})

		cy.contains('button', 'Next').click()
		cy.wait(300)
		cy.get('tbody').find("tr")
			.then((row) => {
				expect(row.length).eq(3)
			})

		cy.contains('p', 'BASICS').click()
		cy.get('input[placeholder="Search by label."').type('CLI{enter}').type('L2VPN{enter}')
		cy.wait(300)
		cy.get('tbody tr').should(($tr) => {
			expect($tr).to.have.length(0)
		})
		cy.get('.chakra-input__right-element > .chakra-button').click()
		cy.contains('button', '3').click()
	})

	it('filter by keyword', () => {
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.url().should('include', 'definitions')
		cy.get('input[placeholder="Search by keyword."').type('Create_loopback')
		cy.wait(300)
		cy.get('tbody').find("tr")
			.then((row) => {
				expect(row.length).eq(2)
			})
		cy.get('input[placeholder="Search by keyword."').type('_all')
		cy.wait(300)
		cy.get('tbody').find("tr")
			.then((row) => {
				expect(row.length).eq(1)
			})
		cy.get('input[placeholder="Search by keyword."').clear()
		cy.wait(300)
		cy.get('tbody').find("tr")
			.then((row) => {
				expect(row.length).eq(10)
			})
	})
	it('wf uninstall all devices', () => {
		cy.get('button[class="chakra-button chakra-menu__menu-button css-1unm9xp"]').click()
		cy.get('p[class="chakra-text css-722v25"]').eq(1).click()
		cy.url().should('include', 'definitions')
		cy.get('input[placeholder="Search by keyword."').type('Uninstall_all_from_inventory')
		cy.wait(300)
		cy.get('tbody').find("tr")
				.then((row) => {
					expect(row.length).eq(1)
				})
		cy.xpath('/html/body/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[4]/div/div/button[2]').click()
		cy.get('input[placeholder="Enter the input"]').type('CREATE_LOOPBACK_DEMO')
		cy.contains('button', 'Execute').click()
		cy.contains('a', '-', {timeout: 10000}).click()
		cy.url().then(urlString => {
			let wf_id_array = urlString.split('/')
			const wf_id = wf_id_array[wf_id_array.length - 1]
		})
		cy.contains('div', 'Status', {timeout: 1200000}).should('contain', 'COMPLETED')
	})
	
	it('wf install all devices', () => {
		cy.get('button[class="chakra-button chakra-menu__menu-button css-1unm9xp"]').click()
		cy.get('p[class="chakra-text css-722v25"]').eq(1).click()
		cy.url().should('include', 'definitions')
		cy.get('input[placeholder="Search by keyword."').type('Install_all_from_inventory')
		cy.wait(300)
		cy.get('tbody').find("tr")
				.then((row) => {
					expect(row.length).eq(2)
				})
		cy.xpath('/html/body/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[4]/div/div/button[2]').click()
		cy.get('input[placeholder="Enter the input"]').type('CREATE_LOOPBACK_DEMO')
		cy.contains('button', 'Execute').click()
		cy.contains('a', '-', {timeout: 10000}).click()
		cy.url().then(urlString => {
			let wf_id_array = urlString.split('/')
			const wf_id = wf_id_array[wf_id_array.length - 1]
		})
		cy.xpath('/html/body/div[1]/div[2]/div/div[2]/div/div[4]/div/text()').then(status =>{
			cy.log(status)
		})
		cy.contains('div', 'Status', {timeout: 1200000}).should('contain', 'COMPLETED')
	})
	
	it('try add wf to favourite', () => {
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.get("button[class='chakra-button chakra-menu__menu-button css-byrfz9']").eq(0).click()
		cy.get("button[class='chakra-menu__menuitem css-13c7rae']").eq(0).click()
		cy.get('button[title="Favourites"]').click()
		cy.wait(500)
		cy.get('tbody').find("tr")
			.then((row) => {
				expect(row.length).eq(1)
			})
		cy.get("button[class='chakra-button chakra-menu__menu-button css-byrfz9']").eq(0).click()
		cy.get("button[class='chakra-menu__menuitem css-13c7rae']").eq(0).click()
	})

	it.skip('try add wf to scheduled', () => {
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.get('input[placeholder="Search by keyword."').type('Create_loopback_')
		cy.get("button[class='chakra-button chakra-menu__menu-button css-byrfz9']").eq(0).click()
		cy.get("button[class='chakra-menu__menuitem css-13c7rae']").wait(500).eq(3).click()
		var now = new Date(); 
		var year = now.getFullYear();
		var month = now.getMonth()+1; 
		var day = now.getDate();
		var hour = now.getHours();
		var minute = now.getMinutes()+1;
		var second = now.getSeconds();
		var crontab_value = minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + '*'
		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[1]/input').clear().type(crontab_value)
		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[2]/label/span[1]').click()
		var wf_content = `{"input":{"labels":"CREATE_LOOPBACK_DEMO"},"scheduleName":"frinx___Create_loopback_all_in_uniconfig:1","labels":"CREATE_LOOPBACK_DEMO","loopback_id":"789"}}`
		cy.get('.ace_content').type('{backspace}{backspace}')
		cy.get('.ace_content').type(wf_content, { parseSpecialCharSequences: false })
		cy.xpath('/html/body/div[4]/div[4]/div/section/footer/div/button[1]').click()
		cy.get('[href="/frinxui/uniflow/scheduled"]').click()
		cy.wait(300)
		cy.get('tbody', {timeout:2500}).find("tr")
			.then((row) => {
				expect(row.length).eq(1)
			})
		cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr/td[5]/div/div/button[2]').click()
		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[1]/input')
			.invoke('val')
			.then((crontab_value_2) => {
				cy.log(crontab_value_2);
				expect(crontab_value_2).eq(crontab_value)
			})
		cy.get('.chakra-checkbox__control').should('have.attr', 'data-checked') 
		cy.xpath('/html/body/div[5]/div[4]/div/section/div/form/div[2]/label/input')
			.check({ force: true })
			.should('be.checked')
		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[3]/div/div[2]/div/div[3]/div[6]/div/span[2]')
			.invoke('text')
			.then((loopback_id) => {
				cy.log(loopback_id);
				expect(loopback_id).eq(`"789"`)
			})

		recurse(
			function () {
				return cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[3]').invoke('text')
			},
			function (s) {
				return s === "RUNNING"
			},
			{
				limit: 250,
				delay: 500,
				timeout: 60_000,
				log: false,
				reduceFrom: [],
				reduce(text_arr, s) {
					text_arr.push(s)
				},
				post() {
					cy.reload()
				},
				yield: 'reduced',
			},
		).then(function (text_arr) {
			expect(text_arr).to.not.include("RUNNING")
		})

		recurse(
			function () {
				return cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[3]').invoke('text')
			},
			function (s) {
				return s === "COMPLETED"
			},
			{
				limit: 600,
				delay: 500,
				timeout: 300_000,
				log: false,
				reduceFrom: [],
				reduce(text_arr, s) {
					text_arr.push(s)
				},
				post() {
					cy.reload()
				},
				yield: 'reduced',
			},
		).then(function (text_arr) {
			expect(text_arr).to.not.include("COMPLETED")
		})
		cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr/td[5]/div/div/button[1]/span').click()
		cy.xpath('/html/body/div[1]/div[2]/div/div').should('contain','There are no scheduled workflows yet')
	})

	it('try create wf', () => {
		cy.get('button[class="chakra-button chakra-menu__menu-button css-1unm9xp"]').click()
		cy.get('p[class="chakra-text css-722v25"]').eq(1).click()
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
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.get('input[placeholder="Search by keyword."').type('test_name_001')
		cy.get('tbody tr').should(($tr) => {
			expect($tr).to.have.length(0)
		})
	})
})
