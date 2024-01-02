/// <reference types="Cypress" />

beforeEach(function () {
    cy.visit('./src/index.html')
})


describe('Central de Atendimento ao Cliente TAT', function () {
    const timeTick = 3000
    it('verifica o título da aplicação', function () {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    })

    Cypress._.times(2, () => {
        it('preenche os campos obrigatórios e envia o formulário', function () {
            const longTest = Cypress._.repeat('abc123fgh456ijl789', 50)

            cy.clock()

            cy.get('#firstName').type('Alexandre').should('have.value', 'Alexandre')
            cy.get('#lastName').type('Coimbra').should('have.value', 'Coimbra')
            cy.get('#email').type('alexcoim@email.com').should('have.value', 'alexcoim@email.com')
            cy.get('#product').select('cursos').should('have.value', 'cursos')
            cy.get('input[value="elogio"]').check()
            cy.get('#open-text-area').type(longTest, { delay: 0 })

            cy.contains('button', 'Enviar').click()
            cy.get('.success strong').should('be.visible').and('have.text', 'Mensagem enviada com sucesso.')

            cy.tick(timeTick)

            cy.get('.success strong').should('not.be.visible')
        })
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.clock()

        cy.get('#email').type('alexcoim.email.com')
        cy.contains('Enviar').click()
        cy.get('.error strong').should('be.visible').and('have.text', 'Valide os campos obrigatórios!')

        cy.tick(timeTick)

        cy.get('.error strong').should('not.be.visible')
    })

    it('não permite valor não-numérico em telefone', function () {
        cy.get('#phone').type('ABCabc123').should('have.value', '123')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.clock()

        cy.get('#firstName').type('Alexandre').should('have.value', 'Alexandre')
        cy.get('#lastName').type('Coimbra').should('have.value', 'Coimbra')
        cy.get('#email').type('alexcoim@email.com').should('have.value', 'alexcoim@email.com')
        cy.get('#product').select('cursos').should('have.value', 'cursos')
        cy.get('input[value="elogio"]').check()
        cy.get('#open-text-area').type('Great Scott!').should('have.value', 'Great Scott!')

        cy.get('#phone-checkbox').click()
        cy.get('#phone').type('ABCabc')

        cy.contains('button', 'Enviar').click()

        cy.get('.error strong').should('be.visible').and('have.text', 'Valide os campos obrigatórios!')

        cy.tick(timeTick)

        cy.get('.error strong').should('not.be.visible')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Alexandre').should('have.value', 'Alexandre').clear().should('have.value', '')
        cy.get('#lastName').type('Coimbra').should('have.value', 'Coimbra').clear().should('have.value', '')
        cy.get('#email').type('alexcoim@email.com').should('have.value', 'alexcoim@email.com').clear().should('have.value', '')
        cy.get('#open-text-area').type('Great Scott!').should('have.value', 'Great Scott!').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.clock()

        cy.contains('button', 'Enviar').click()
        cy.get('.error strong').should('be.visible').and('have.text', 'Valide os campos obrigatórios!')

        cy.tick(timeTick)

        cy.get('.error strong').should('not.be.visible')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit().should('be.visible').and('have.text', 'Mensagem enviada com sucesso.')

        cy.tick(timeTick)

        cy.get('.success strong').should('not.be.visible')
    })

    it('seleciona um produto (YouTube) por seu texto', function () {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function () {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice', function () {
        cy.get('#product').select(1).should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function () {
        cy.get('input[value="feedback"]').check().should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function () {
        cy.get('#support-type input').should('have.length', 3).each(function ($radio) {
            cy.wrap($radio).check().should('be.checked')
        })
    })

    it('marca ambos checkboxes, depois desmarca o último', function () {
        cy.get('#check input').should('have.length', 2).check().should('be.checked')
        cy.get('#check input').last().uncheck().should('not.be.checked')
    })

    it('seleciona um arquivo da pasta fixtures', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json')
            .should(function ($input) {
                const uploadFile = $input[0].files[0].name

                expect('example.json').be.eq(uploadFile)
            })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function () {
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('cypress/fixtures/example.json', { action: 'drag-drop' })
            .should(function ($input) {
                const uploadFile = $input[0].files[0].name

                expect('example.json').be.eq(uploadFile)
            })
    })

    it('eleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function () {
        cy.fixture('example.json').as('file')
        cy.get('input[type="file"]')
            .should('not.have.value')
            .selectFile('@file')
            .should(function ($input) {
                const uploadFile = $input[0].files[0].name

                expect('example.json').be.eq(uploadFile)
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function () {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it(' acessa a página da política de privacidade removendo o target e então clicando no link', function () {
        cy.get('#privacy a').invoke('removeAttr', 'target').click()
        cy.contains('Talking About Testing').should('be.visible')

        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT - Política de privacidade')
        cy.get('.privacy').should('be.visible')
        cy.get('.privacy p')
            .should(function ($lastP) {
                expect($lastP[3].innerHTML).to.equal('Talking About Testing')
            })
            .first()
            .should('have.text', 'Não salvamos dados submetidos no formulário da aplicação CAC TAT.')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', () => {
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

      it('preenche a area de texto usando o comando invoke', function() {
        cy.clock()
        
        cy.fillMandatoryFieldsAndSubmit().should('be.visible').and('have.text', 'Mensagem enviada com sucesso.')

        cy.tick(timeTick)

        cy.get('.success strong').should('not.be.visible')
      })

      it('faz uma requisição HTTP', function() {
        cy.request('GET', 'https://cac-tat.s3.eu-central-1.amazonaws.com/index.html').then((response) => {
            console.log(response)

            expect(response.status).to.equal(200)
            expect(response.statusText).to.equal('OK')
            expect(response.body).include('CAC TAT')
        })
      })

      it.only('show me the cat', function() {
        cy.get('#cat')
            .should('not.be.visible')
            .invoke('show')
            .should('be.visible')

      })
})