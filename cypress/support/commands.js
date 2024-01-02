// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function() {
    cy.get('#firstName').type('Alexandre').should('have.value', 'Alexandre')
    cy.get('#lastName').type('Coimbra').should('have.value', 'Coimbra')
    cy.get('#email').type('alexcoim@email.com').should('have.value', 'alexcoim@email.com')

    cy.get('#product').select('cursos').should('have.value', 'cursos')
    cy.get('input[value="elogio"]').check()

    cy.get('#open-text-area').type('Great Scott!').should('have.value', 'Great Scott!')

    cy.contains('button', 'Enviar').click()

    return cy.get('.success strong')
})