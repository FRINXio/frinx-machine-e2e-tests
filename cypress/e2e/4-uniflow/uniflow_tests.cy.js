import { recurse } from 'cypress-recurse';

describe('frinx testy', () => {

	it('workflow page', () => {
		cy.visit(Cypress.env('host'))
		cy.get('#menu-button-2').click()
		cy.get('#menu-list-2-menuitem-4').click()
		cy.get('h1').should('include.text', 'Workflows')
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.get('h1').should('include.text', 'Workflows')
	})
	
	
	// WORKING
	it('filter by label', () => {
		cy.visit(Cypress.env('host'))
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.get('input').eq(1).type('CLI{enter}')
		cy.get('tbody').find("tr")
    		.then((row) => {
      		expect(row.length).eq(6)
      	})

    	cy.get('.chakra-input__right-element > .chakra-button').click()

    	cy.get('input').eq(1).type('BASICS{enter}')
    	cy.get('tbody').find("tr")
    		.then((row) => {
			expect(row.length).eq(10)
	      	})

    	cy.get('.pagination-container > .chakra-stack > :nth-child(2) > .chakra-button').click()
    	cy.get('tbody').find("tr")
    		.then((row) => {
			expect(row.length).eq(3)
      		})

    	cy.get('.chakra-input__right-element > .chakra-button').click()
    	cy.get('input').eq(1).type('CLI{enter}').type('L2VPN{enter}')
    	cy.get('tbody tr').should(($tr) => {
			expect($tr).to.have.length(0)
		})
	})

	
	// WORKING
	it('wf uninstall all devices', () => {
		cy.visit(Cypress.env('host'))
		cy.get('#menu-button-2').click()
		cy.get('#menu-list-2-menuitem-4').click()
		cy.url().should('include', 'definitions')
		cy.get(':nth-child(3) > .chakra-input__group > .chakra-input').type('Uninstall_all_from_inventory')

		cy.get('tbody').find("tr")
				.then((row) => {
				expect(row.length).eq(1)
				})

		cy.get('.css-1c2ov43 > .css-sngb > .feather', {timeout: 7000}).click()

		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div/div/div/div[1]/input').type('CREATE_LOOPBACK_DEMO')
		cy.get('.css-13x9wmi').click() // click on execute
		cy.xpath('/html/body/div[4]/div[4]/div/section/footer/a', {timeout: 10000}).click()

		cy.url().then(urlString => {
			cy.log(urlString)

			let wf_id_array = urlString.split('/')
			const wf_id = wf_id_array[wf_id_array.length - 1]

			cy.log(wf_id)
		})

		//verify
		cy.get(':nth-child(4) > .css-79wky', {timeout: 1200000}).should('contain', 'COMPLETED')

	})
	
	// WORKING
	it('wf install all devices', () => {
		cy.visit(Cypress.env('host'))
		cy.get('#menu-button-2').click()
		cy.get('#menu-list-2-menuitem-4').click()
		cy.url().should('include', 'definitions')
		cy.xpath('/html/body/div[1]/div[2]/div[2]/div/div[3]/div/input').type('Install_all_from_inventory')

		cy.get('tbody').find("tr")
				.then((row) => {
				expect(row.length).eq(2)
				})

		cy.xpath('/html/body/div[1]/div[2]/div[2]/table/tbody/tr[1]/td[4]/div/div/button[2]', {timeout: 7000}).click()


		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div/div/div/div[1]/input').type('CREATE_LOOPBACK_DEMO')
		cy.xpath('/html/body/div[4]/div[4]/div/section/footer/div/button[1]').click() // click on execute
		cy.xpath('/html/body/div[4]/div[4]/div/section/footer/a', {timeout: 10000}).click()

		cy.url().then(urlString => {
			let wf_id_array = urlString.split('/')
			const wf_id = wf_id_array[wf_id_array.length - 1]
		})

		//verify
		cy.xpath('/html/body/div[1]/div[2]/div/div[2]/div/div[4]/div/text()').then(status =>{
			cy.log(status)
		})

		cy.get(':nth-child(4) > .css-79wky', {timeout: 600000}).should('contain', 'COMPLETED')
	})
	
	//WORKING
	it('try add wf to favourite', () => {
		cy.visit(Cypress.env('host'))
		cy.get('[href="/frinxui/uniflow/definitions"]').click()

		cy.xpath('//*[@id="menu-button-23"]').click()
		cy.xpath('//*[@id="menu-list-23-menuitem-18"]').click()

		cy.get('#menu-button-79').click()
		cy.get('#menu-list-79-menuitem-74').click()

		cy.get('#root > div.css-1wstn4q > div:nth-child(2) > div > div.css-3pzkt9 > button').click()

		cy.wait(2000)

		cy.get('tbody', {timeout:2500}).find("tr")
    		.then((row) => {
	      		expect(row.length).eq(2)
	      	})

    		// remove from favourites wf
    		cy.get('#menu-button-79').click()
		cy.get('#menu-list-79-menuitem-74').click()
		cy.get('#menu-button-23').click()
		cy.get('#menu-list-23-menuitem-18').click()

	})
	

	it('try add wf to scheduled', () => {

		cy.visit(Cypress.env('host'))
		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		
		cy.get('#menu-button-79').click()
		cy.get('#menu-list-79-menuitem-77').click()

		var now     = new Date(); 
		var year    = now.getFullYear();
		var month   = now.getMonth()+1; 
		var day     = now.getDate();
		var hour    = now.getHours()-2;
		var minute  = now.getMinutes()+1;
		var second  = now.getSeconds();

		var crontab_value = minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + '*'

		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[1]/input').clear().type(crontab_value)
		cy.xpath('/html/body/div[4]/div[4]/div/section/div/form/div[2]/label/span[1]').click()
		
		var wf_content = '{"input":{"labels":"CREATE_LOOPBACK_DEMO"},"scheduleName":"frinx___Create_loopback_all_in_uniconfig:1","labels":"CREATE_LOOPBACK_DEMO","loopback_id":"789"}}'
		cy.get('.ace_content').type('{backspace}{backspace}')
		cy.get('.ace_content').type(wf_content, { parseSpecialCharSequences: false })
		
		cy.xpath('/html/body/div[4]/div[4]/div/section/footer/div/button[1]').click()

		
		// Checking if wf has been added to sheduled tasks
		cy.get('[href="/frinxui/uniflow/scheduled"]').click()

		cy.get('tbody', {timeout:2500}).find("tr")
    		.then((row) => {
	      		expect(row.length).eq(1)
	      	})

    		// NOT WORIKNG - UI do not autorefresh
		//cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[3]', {timeout: 180000}).should('contain', 'RUNNING')
		//cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[3]', {timeout: 600000}).should('contain', 'COMPLETED')

		// Checking if WF was started from sheduled tasks
		recurse(
			function () {
				return cy.xpath('/html/body/div[1]/div[2]/div/table/tbody/tr[1]/td[3]').invoke('text')
			},
			function (s) {
				return s === "RUNNING"
			},
			{
				limit: 250,
				delay: 500, // sleep for 0.5 second before reloading the page
				timeout: 60_000, // try up to one minute
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

		// NOT WORIKNG - UI do not autorefresh
		//cy.visit('http://localhost/frinxui/uniflow/executed')
		//cy.xpath('/html/body/div[1]/div[2]/div/div[4]/table/tbody/tr[1]/td[3]', {timeout: 180000}).should('contain', 'RUNNING')
		//cy.xpath('/html/body/div[1]/div[2]/div/div[4]/table/tbody/tr[1]/td[3]', {timeout: 600000}).should('contain', 'COMPLETED')

	})

	it('try create wf', () => {
		cy.visit(Cypress.env('host'))
		cy.get('#menu-button-2').click()
		cy.get('#menu-list-2-menuitem-4').click()
		cy.url().should('include', 'definitions')

		cy.xpath('/html/body/div[1]/div[2]/div[1]/header/div/div/a').click()

		cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[1]/input').type('test_name_001')
		
		cy.get('#description').type('{backspace}{backspace}')
		//cy.get('#description').type('{{test_description}}')
		cy.get('#description').type('{{}')		
		cy.get('#description').type('test_description')
		cy.get('#description').type('{}}')

		cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[3]/div/input').type('test_label')

		cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[6]/div/div/input').type('qwertz')
		cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[6]/div/div/button').click()

		cy.xpath('/html/body/div[1]/div[2]/div/div/div/form/div[8]/button').click()

		cy.url().should('include', 'builder')

		cy.get('[href="/frinxui/uniflow/definitions"]').click()
		cy.get(':nth-child(3) > .chakra-input__group > .chakra-input').type('test_name_001')
		
		//nie je lebo nebol ulozeny a ulozeny bude iba ak sa don vlozi aspon 1 krok, prazdny WF sa neda ulozit
		cy.get('tbody').find("tr")
				.then((row) => {
					expect(row.length).eq(1)
				})
	})


})
