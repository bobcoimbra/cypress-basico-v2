/// <reference types="Cypress" />

beforeEach(function () {
    cy.visit('./src/index.html')
})


describe('Central de Atendimento ao Cliente TAT', function () {
    it('verifica o título da aplicação', function () {
        cy.title().should('eq', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function () {
        const longTest = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus est tortor, vehicula eu ante eget, rutrum vulputate risus. Curabitur laoreet fermentum dui quis aliquet. Curabitur cursus tortor eu sem mollis, ac rutrum magna mattis. Quisque et eros magna. Nullam ac fermentum dolor. Morbi velit ante, accumsan elementum mollis vel, rhoncus id lorem. Sed elementum, elit vel pellentesque hendrerit, neque est pharetra odio, blandit convallis orci mi vel eros. Nunc et feugiat nisl, nec accumsan erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Phasellus vel pretium mi.     Morbi auctor eu ligula venenatis finibus. Nulla at dolor congue, sollicitudin quam eu, dictum ex. Maecenas laoreet semper viverra. Aenean dignissim dolor sit amet erat ullamcorper molestie. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi dignissim euismod interdum. Vestibulum mauris enim, convallis nec ex at, viverra semper lacus. Donec eget magna fermentum, sagittis ante a, pharetra odio.'

        cy.get('#firstName').type('Alexandre').should('have.value', 'Alexandre')
        cy.get('#lastName').type('Coimbra').should('have.value', 'Coimbra')
        cy.get('#email').type('alexcoim@email.com').should('have.value', 'alexcoim@email.com')

        cy.get('#product').select('cursos').should('have.value', 'cursos')
        cy.get('input[value="elogio"]').check()

        cy.get('#open-text-area').type(longTest, { delay: 0 })

        cy.contains('button', 'Enviar').click()

        cy.get('.success strong').should('be.visible').and('have.text', 'Mensagem enviada com sucesso.')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function () {
        cy.get('#email').type('alexcoim.email.com')
        cy.contains('Enviar').click()
        cy.get('.error strong').should('be.visible').and('have.text', 'Valide os campos obrigatórios!')
    })

    it('não permite valor não-numérico em telefone', function () {
        cy.get('#phone').type('ABCabc123').should('have.value', '123')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
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
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function () {
        cy.get('#firstName').type('Alexandre').should('have.value', 'Alexandre').clear().should('have.value', '')
        cy.get('#lastName').type('Coimbra').should('have.value', 'Coimbra').clear().should('have.value', '')
        cy.get('#email').type('alexcoim@email.com').should('have.value', 'alexcoim@email.com').clear().should('have.value', '')
        cy.get('#open-text-area').type('Great Scott!').should('have.value', 'Great Scott!').clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function () {
        cy.contains('button', 'Enviar').click()
        cy.get('.error strong').should('be.visible').and('have.text', 'Valide os campos obrigatórios!')
    })

    it('envia o formuário com sucesso usando um comando customizado', function () {
        cy.fillMandatoryFieldsAndSubmit().should('be.visible').and('have.text', 'Mensagem enviada com sucesso.')
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


})