/// <reference types="cypress"/>

describe('Display Job lists test Suite', () => {
  describe('Go to the Career page and check the job lists', () => {
    before(() => {
      cy.visit('/')
    })
    it('Check Career page and click on Open position button', () => {
      cy.get('.navbar-brand')

      cy.get('img').should(
        'have.attr',
        'src',
        'https://www.userlane.com/wp-content/themes/userlane/assets/img/userlane-logo.svg'
      )
      cy.get('.entry-content')
      cy.get('.container')
      cy.get('.hero-headline').contains(' We’re all about')
      cy.contains('people')
      cy.get('.cta-button')
        .parents('.mt-5')
        .find('a')
        .should('have.attr', 'href', '#careers-at-userlane')
        .click()
      cy.get('h4').contains('Apply and join the company')
      cy.get('.section-headline').contains('Career Opportunities')
    })
    it('Displays job teams and positions list', () => {
      cy.intercept(
        'GET',
        'https://api.lever.co/v0/postings/userlane?group=team&mode=json'
      ).as('getjoblists')
      cy.visit('/')
      cy.wait('@getjoblists').its('response.statusCode').should('eq', 200)
      cy.get('@getjoblists').then((result) => {
        const responseBody = result.response.body

        responseBody.forEach((team) => {
          console.log(team.title)
          cy.get('.jobs-teams').contains(team.title)
          const jobPostings = team.postings

          jobPostings.forEach((posting) => {
            cy.get('.jobs-list').contains(posting.text)
            console.log(posting.text)
          })
        })
      })
    })

    it('Stubbing the response with mock data to display the Engineering team only ', () => {
      cy.intercept(
        'GET',
        'https://api.lever.co/v0/postings/userlane?group=team&mode=json',
        { fixture: 'jobslist.json' }
      ).as('mockjobs')
      cy.visit('/')
      cy.wait('@mockjobs').its('response.statusCode').should('eq', 200)
    })
  })
})
