/// <reference types="cypress" />
// first-test.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('admin-faro-pay', () => {

    beforeEach(() => {
        cy.visit('http://testadmin.faro-pay.com/') //eslint-disable-line
    })

    it('Login Fail function', () => {
        cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-dvgyha').type('quandang@faro-pay.com2')
        cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1ijd1x7').type('quandang@faro-pay.com')
        cy.get('.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-disableElevation.MuiButtonBase-root').click()

        cy.contains('Username or password is incorrect').should('exist');


        cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-dvgyha').type('quandang@faro-pay.com')
        cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1ijd1x7').type('quandang@faro-pay.com2')
        cy.get('.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-disableElevation.MuiButtonBase-root').click()

        cy.contains('Username or password is incorrect').should('exist');
    })


    it('Login Success function', () => {
        cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-dvgyha').type('quandang@faro-pay.com')
        cy.get('.MuiOutlinedInput-input.MuiInputBase-input.css-1ijd1x7').type('quandang@faro-pay.com')
        cy.get('.MuiButton-root.MuiButton-contained.MuiButton-containedPrimary.MuiButton-sizeMedium.MuiButton-containedSizeMedium.MuiButton-disableElevation.MuiButtonBase-root').click()

        cy.url().should('include', '/dashboard')
    })

})