

describe("master test for checking multiple device inventory settings",()=>{

    var deviceInventoryUrl = Cypress.env('host') + "/frinxui/inventory/devices"

    it("should visit the main and device page",()=>{

        cy.visit(Cypress.env('host'))
        cy.get("a[href='/frinxui/inventory']").eq(0).click()
        cy.get("img[alt='logo']").should("be.visible")
        cy.get("a[href='/frinxui/']").eq(0).click()
        cy.get("div[class=css-1q8b5yy]").contains("Device Inventory").click()
        cy.visit(Cypress.env('host'))
        cy.get("button[class='chakra-button chakra-menu__menu-button css-1unm9xp']").click()
        cy.get("div[class='css-k2as7w']").contains("Device Inventory").click()  
    })

    it("should find device by name and install afterwards",()=>{

        cy.wait(500)
        cy.get("input[placeholder='Start typing...']").click()
        cy.contains("IOS").click()
        cy.get("button[class='chakra-button css-9560t']").click()
        cy.get("span[class='chakra-checkbox__control css-xxkadm']").eq(3).click()
        cy.get("span[class='chakra-checkbox__control css-xxkadm']").eq(4).click()
        cy.get("span[class='chakra-checkbox__control css-xxkadm']").eq(7).click()
        cy.contains("Install selected").click()
        cy.get("span[class='chakra-text css-1wihwec']",{timeout:80000}).should("be.visible")
        cy.get("span[class='chakra-checkbox__control css-xxkadm']").eq(3).should('have.attr', 'data-disabled')
        cy.get("span[class='chakra-checkbox__control css-xxkadm']").eq(4).should('have.attr', 'data-disabled')
        cy.get("span[class='chakra-checkbox__control css-xxkadm']").eq(7).should('have.attr', 'data-disabled')
        cy.get("button[class='chakra-button css-gjwknl']").eq(2).should("have.attr", "disabled")
        cy.get("button[class='chakra-button css-gjwknl']").eq(3).should("have.attr", "disabled")
        cy.get("button[class='chakra-button css-gjwknl']").eq(6).should("have.attr", "disabled")
        cy.get("svg[class='feather feather-settings chakra-icon css-13otjrl']").eq(3).click()
        cy.contains("Config data store").should("be.visible")
    })

    it("should search device by label and install it afterwards",()=>{

        cy.visit(deviceInventoryUrl)
        cy.get("input[placeholder='Search device']").click().type("IOS01")
        cy.get("button[class='chakra-button css-9560t']").click()
        cy.wait(500)
        cy.get("button[class='css-3d6azp']").click()
        cy.contains("Installed", {timeout:30000})
    })

    it("should uninstall installed devices",()=>{

        cy.visit(deviceInventoryUrl)
        cy.get("span[class='chakra-text css-1wihwec']").should("be.visible")
        cy.get("span[class='chakra-text css-1wihwec']").click({multiple:true})
        cy.contains("Installed").should("not.exist")
    })

    it("should check if added labe/name can be removed",()=>{

        cy.contains("Filter by labels").click()
        cy.contains("XR").click()
        cy.get("Label[for='device-search']").click()
        cy.get("input[placeholder='Start typing...']").click()
        cy.contains("XR").click()
        cy.get("input[placeholder='Search device']").click().type("XR01")
        cy.get("button[class='chakra-button css-9560t']").click()
        cy.wait(1000)
        cy.get("input[value='XR01']").clear()
        cy.get("svg[class='chakra-icon css-1md6f3y']").click()
        cy.get("button[class='chakra-button css-9560t']").click()
    })

    it("should edit chosen device",()=>{

        cy.get("svg[class='feather feather-edit chakra-icon css-13otjrl']").eq(0).click()
        cy.get("div[class='chakra-select__wrapper css-42b2qy']").click()
        cy.get("select[class='chakra-select css-k7r2wc']").select("In Service")
        cy.get("input[placeholder='Enter vendor of the device']").click().type("NOKIA")
        cy.get("input[placeholder='Enter model of the device']").click().type("CRI-24-Y8")
        cy.get("input[placeholder='Enter address of the device']").click().type("192.168.01.17")
        cy.get("svg[class='chakra-icon css-1md6f3y']").eq(0).click()
        cy.get("input[placeholder='Start typing...']").type("EXAMPLE")
        cy.contains("EXAMPLE").should("be.visible").click()
        cy.get("button[class='chakra-button css-8pcd7y']").click()
    })

    
    it.skip("should check edited device",()=>{
        cy.visit(Cypress.env('deviceInventory'))
        cy.get("svg[class='feather feather-edit chakra-icon css-13otjrl']").eq(0).click()
        cy.wait(500)
        cy.contains("In Service").should("be.visible")
        cy.contains("NOKIA").should("be.visible")
        cy.contains("CRI-24-Y8").should("be.visible")
        cy.contains("192.168.01.17").should("be.visible")
        cy.contains("EXAMPLE").should("be.visible")
    })
    

    it("should not be able to see seetings of uninstalled device",()=>{

        cy.visit(deviceInventoryUrl)
        cy.get("svg[class='feather feather-settings chakra-icon css-13otjrl']").eq(0).click()
        cy.contains("GraphQL").should("be.visible")
        cy.contains("Mount parameters").should("not.exist")
        cy.visit(deviceInventoryUrl)
    })

    it("should uninstall specific device",()=>{

        cy.get("input[placeholder='Search device']").click().type("SAOS6_2")
        cy.get("button[class='chakra-button css-9560t']").click()
        cy.wait(500)
        cy.get("button[aria-label='Delete device']").click()
        cy.get("button[class='chakra-button css-taj3dd']").contains("Cancel").should("be.visible").click()
        cy.get("button[aria-label='Delete device']").click()
        cy.get("button[class='chakra-button css-1c60fpj']").contains("Delete").should("be.visible").click()
        cy.visit(deviceInventoryUrl)
        cy.contains("SAOS6_2").should("not.exist")
    })

    it("should add device without blueprint",()=>{

        var textParameters = '{"cli":{"cli-topology:host":"sample-topology","cli-topology:port":"10003","cli-topology:password":"frinx","cli-topology:username":"frinx","cli-topology:device-type":"saos","cli-topology:journal-size":500,"cli-topology:device-version":"8","cli-topology:parsing-engine":"one-line-parser","cli-topology:transport-type":"ssh","cli-topology:dry-run-journal-size":180}}'

        cy.visit(deviceInventoryUrl)
        cy.wait(500)
        cy.get("a[class='chakra-button css-8pcd7y']").click()
        cy.get("input[name='name']").click().type("Example_SAOS_device")
        cy.get("select[class='chakra-select css-k7r2wc']").eq(0).select("uniconfig")
        cy.get("select[class='chakra-select css-k7r2wc']").eq(1).select("In Service")
        cy.get("input[name='vendor']").click().type("Example_vendor")
        cy.get("input[name='model']").click().type("Example_model")
        cy.get("input[name='address']").click().type("198.162.5.12")
        cy.get("div[class='chakra-stack css-x9juev']").click().type("SAOS")
        cy.contains("SAOS").should("be.visible").click()
        cy.get("div[class='ace_content']").type("{backspace}{backspace}")
        cy.get("div[class='ace_content']").type(textParameters,{parseSpecialCharSequences:false})
        cy.get("button[class='chakra-button css-8pcd7y']").contains("Add device").click()
        cy.contains("Device succesfully added").should("be.visible")

      })

    it("should remove example_device with delete selected button",()=>{

        cy.visit(deviceInventoryUrl)
        cy.get("input[placeholder='Search device']").click().type("Example_SAOS_device")
        cy.get("button[class='chakra-button css-9560t']").click()
        cy.get("span[class='chakra-checkbox__control css-xxkadm']").eq(1).click()
        cy.get("button[class='chakra-button css-u1achi']").click()
        cy.get("button[class='chakra-button css-taj3dd']").contains("Cancel").click()
        cy.wait(500)
        cy.get("button[class='chakra-button css-u1achi']").click()
        cy.get("button[class='chakra-button css-1c60fpj']").click()
        cy.visit(deviceInventoryUrl)
    })

    it("should add SAOS6_2 with blueprint",()=>{

        cy.visit(deviceInventoryUrl)
        cy.get("a[class='chakra-button css-8pcd7y']").click()
        cy.get("input[name='name']").click().type("SAOS6_2")
        cy.get("select[class='chakra-select css-k7r2wc']").eq(0).select("uniconfig")
        cy.get("select[class='chakra-select css-k7r2wc']").eq(1).select("In Service")
        cy.get("input[class='chakra-input css-ykzfd5']").click()
        cy.contains("CLI").click()
        cy.contains("SAOS").click()
        cy.contains("Vendor").click()
        cy.get("span[class='chakra-switch__thumb css-7roig']").click()
        cy.get("select[class='chakra-select css-k7r2wc']").eq(2).select("cli_saos_device")
        cy.get("input[type='text']").eq(0).click().type("one-line-parser")
        cy.get("input[type='text']").eq(1).click().type("frinx")
        cy.get("input[type='text']").eq(2).click().type("frinx")
        cy.get("input[type='text']").eq(3).click().type("6")
        cy.get("input[type='text']").eq(4).click().type("saos")
        cy.get("input[type='text']").eq(5).click().type("10000")
        cy.get("button[class='chakra-button css-taj3dd']").click()
        cy.get("button[class='chakra-button css-8pcd7y']").click()
    })

    it("should handle adding and using blueprint",()=>{

        cy.visit(deviceInventoryUrl)
        cy.contains("Blueprints").click()
        cy.get("a[class='chakra-button css-8pcd7y']").click()
        cy.get("input[class='chakra-input css-1c6j008']").click().type("Example_Blueprint")
        cy.get("textarea[class='chakra-textarea css-1eze8uz']").type("Example_Content")
        cy.get("button[class='chakra-button css-8pcd7y']").click()
        cy.contains("Example_Blueprint")
        cy.visit(deviceInventoryUrl)
        cy.get("a[class='chakra-button css-8pcd7y']").click()
        cy.get("span[class='chakra-switch__thumb css-7roig']").click()
        cy.get("select[class='chakra-select css-k7r2wc']").eq(2).select("Example_Blueprint")
        cy.visit(deviceInventoryUrl)
        cy.contains("Blueprints").click()
        cy.get("button[class='chakra-button css-gjwknl']").eq(4).click()
    })

    it("should check transactions and config change in Leaf01",()=>{

        cy.visit(deviceInventoryUrl)
        cy.get("input[placeholder='Search device']").click().type("Leaf01")
        cy.get("button[class='chakra-button css-9560t']").click()
        cy.wait(500)
        cy.get("span[class='chakra-text css-1a676jl']").click()
        cy.contains("Installed", {timeout:200000}).should("be.visible")
        cy.get("svg[class='feather feather-settings chakra-icon css-13otjrl']").click()
        cy.get("button[class='chakra-button css-1ea4osk']").click()
        cy.contains("Sync from network", {timeout:100000})
        cy.wait(500)
        cy.get("div[class='ace_content']").eq(0).click().type('"description":"something",')
        cy.get("button[class='chakra-button css-uau6fs']").click()
        cy.contains("Success",{timeout:1000}).should("be.visible")
        cy.get("button[class='chakra-button css-1t5i07l']").eq(1).click()
        cy.contains("Dry run commit output",{timeout:100000})
        cy.get("button[class='chakra-button css-taj3dd']").click()
        cy.get("button[class='chakra-button css-1t5i07l']").eq(0).click()
        cy.contains("Calculated diff output", {timeout:100000})
        cy.get("button[class='chakra-button css-taj3dd']").click()
        cy.wait(1000)
        cy.get("button[class='chakra-button css-19fzkxm']").click()
        cy.contains("Successfully commited to network",{timeout:15000})
        cy.get("button[class='chakra-button css-1ea4osk']").click()
        cy.contains("Successfully synced from network",{timeout:100000})
        cy.get("a[class='chakra-link css-14pkqpo']").eq(2).click()
        cy.get("button[class='chakra-button css-17mgpuf']").eq(0).click()
        cy.get("button[class='chakra-button css-8pcd7y']").click()
        cy.contains("Transaction successfuly reverted",{timeout:1000})
        cy.get("a[class='chakra-badge css-hn526q']").eq(0).click()
        cy.contains('"description":"something"').should("not.exist")
    })

})
