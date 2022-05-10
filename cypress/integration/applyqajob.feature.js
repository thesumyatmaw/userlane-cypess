/// <reference types="cypress"/>
import { getResolvedCaptchaKey } from '../support/utils'

const mockCandidate = {
  Fullname: 'The Su Myat Maw',
  email: 'sumyat@mailinator.com',
  phone: '+49111111118',
  currentCompany: 'abc',
  linkInURL: 'https://www.linkedin.com/in/the-su-myat-maw-7b036b68',
  noticePeriod: 'Immediate',
  relocation: 'No',
  salary: 'Euro 50000 per Annum',
  experienceCypress: 'Yes',
  addtionalInfo: 'Automate Testing',
}

describe('Apply QA Job test Suite', () => {
  it('Search QA job', () => {
    cy.intercept(
      'GET',
      'https://api.lever.co/v0/postings/userlane?group=team&mode=json'
    ).as('getjoblists')
    cy.visit('/')
    cy.wait('@getjoblists').its('response.statusCode').should('eq', 200)

    cy.get('@getjoblists').then((result) => {
      const responseBody = result.response.body
      const teamTitle = 'Engineering'
      const qaJobTitle = 'Automation Test Engineer (Cypress/Typescript)'
      const engineeringTeam = responseBody.find(
        (team) => team.title === teamTitle
      )

      const qaJob = engineeringTeam.postings.find(
        (job) => job.text === qaJobTitle
      )
      cy.get('.jobs-teams').contains(teamTitle).click()
      cy.get('.jobs-list').contains(qaJobTitle)
      cy.contains('a', qaJobTitle)
        .should('have.attr', 'href', qaJob.hostedUrl)
        .should('have.attr', 'target', '_blank')
        .should('have.attr', 'rel', 'noopener, nofollow')
      cy.request(qaJob.hostedUrl).its('status').should('eq', 200)
    })
  })

  describe('Display QA role description & apply this job', () => {
    // [Future improvement]
    // We can use cy.task for storing the dynamic Url (QA Job URL from above test case) when we want to use it across the test cases.
    // Currently, I am not familiar with the cy.task feature. I need to learn more about this plugin event.
    // So, I am directly called hosted Url.
    beforeEach(() => {
      cy.visit(
        'https://jobs.lever.co/userlane/19b969e3-e406-486c-82e6-483f62fe597f'
      )
      cy.get('.posting-headline')
      cy.contains('h2', 'Automation Test Engineer (Cypress/Typescript)')
      cy.contains('a', 'Apply for this job').click()
    })

    it('Display error message if the job has no name', () => {
      cy.contains('h2', 'Automation Test Engineer (Cypress/Typescript)')
      cy.contains('h4', 'Submit your application')
      cy.get('[type="submit"]').click()
      cy.get('input:invalid').should('have.length', 9)
    })

    it('Display error message if the job has invalid email address', () => {
      const invalidEmails = [
        '#e',
        'dde#@',
        '***&',
        '*@ddd',
        'thesumyatmaw@gmail.comthesumyatmaw@gmail.com',
      ]
      cy.contains('h2', 'Automation Test Engineer (Cypress/Typescript)')
      cy.contains('h4', 'Submit your application')
      cy.get('[name="name"]').type(mockCandidate.Fullname)

      invalidEmails.forEach((invalidEmail) => {
        cy.get('[type="email"]').type(invalidEmail)
        cy.get('[type="submit"]').click()
        cy.get('input:invalid').should('have.length', 8)
      })
    })

    it('Display error message if the job is no attach resume & not bypass captcha', () => {
      cy.contains('h2', 'Automation Test Engineer (Cypress/Typescript)')
      cy.contains('h4', 'Submit your application')
      cy.get('[name="name"]').type(mockCandidate.Fullname)
      cy.get('[type="email"]').type(mockCandidate.email)
      cy.get('[name="phone"]').type(mockCandidate.phone)
      cy.get('[name="org"]').type(mockCandidate.currentCompany)
      cy.get('[name="urls[LinkedIn]"]').type(mockCandidate.linkInURL)
      cy.get('.card-field-input').first().type(mockCandidate.noticePeriod)
      cy.get('[type="radio"]')
        .eq(1)
        .should('have.attr', 'value', mockCandidate.relocation)
        .click()

      cy.get('.card-field-input').eq(1).type(mockCandidate.salary)
      cy.get('[type="radio"]')
        .eq(2)
        .should('have.attr', 'value', mockCandidate.experienceCypress)
        .click()
      cy.get('#additional-information').type(mockCandidate.addtionalInfo)

      cy.get('[type="submit"]').click()
      cy.get('.error-message').contains(
        '✱ Please verify that you are not a robot, and reupload any files.'
      )
    })

    it('Display error message if not bypass captcha', () => {
      cy.contains('h2', 'Automation Test Engineer (Cypress/Typescript)')
      cy.contains('h4', 'Submit your application')
      cy.get('input[type=file]').selectFile(
        'cypress/files/Thesumyatmaw_resume.pdf'
      )
      cy.get('.resume-upload-label', { timeout: 5000 }).contains('Success!')
      cy.get('[name="name"]').type(mockCandidate.Fullname)
      cy.get('[type="email"]').type(mockCandidate.email)
      cy.get('[name="phone"]').type(mockCandidate.phone)
      cy.get('[name="org"]').type(mockCandidate.currentCompany)
      cy.get('[name="urls[LinkedIn]"]').type(mockCandidate.linkInURL)
      cy.get('.card-field-input').first().type(mockCandidate.noticePeriod)
      cy.get('[type="radio"]')
        .eq(1)
        .should('have.attr', 'value', mockCandidate.relocation)
        .click()

      cy.get('.card-field-input').eq(1).type(mockCandidate.salary)
      cy.get('[type="radio"]')
        .eq(2)
        .should('have.attr', 'value', mockCandidate.experienceCypress)
        .click()
      cy.get('#additional-information').type(mockCandidate.addtionalInfo)

      cy.get('[type="submit"]').click()
      cy.get('.error-message').contains(
        '✱ Please verify that you are not a robot, and reupload any files.'
      )
    })

    it('Click apply job with filling data (Please wait for a few seconds while live resolving to bypass captcha)', async () => {
      const captchaKey = await getResolvedCaptchaKey()

      cy.contains('h2', 'Automation Test Engineer (Cypress/Typescript)')
      cy.contains('h4', 'Submit your application')
      cy.get('input[type=file]').selectFile(
        'cypress/files/Thesumyatmaw_resume.pdf'
      )
      cy.get('.resume-upload-label', { timeout: 5000 }).contains('Success!')

      cy.get('[name="name"]').type(mockCandidate.Fullname)
      cy.get('[type="email"]').type(mockCandidate.email)
      cy.get('[name="phone"]').type(mockCandidate.phone)
      cy.get('[name="org"]').type(mockCandidate.currentCompany)
      cy.get('[name="urls[LinkedIn]"]').type(mockCandidate.linkInURL)
      cy.get('.card-field-input').first().type(mockCandidate.noticePeriod)
      cy.get('[type="radio"]')
        .eq(1)
        .should('have.attr', 'value', mockCandidate.relocation)
        .click()

      cy.get('.card-field-input').eq(1).type(mockCandidate.salary)
      cy.get('[type="radio"]')
        .eq(2)
        .should('have.attr', 'value', mockCandidate.experienceCypress)
        .click()
      cy.get('#additional-information').type(mockCandidate.addtionalInfo)

      cy.get('[name="h-captcha-response"]').then((hCaptchaEle) => {
        console.log('Key: ', captchaKey)
        hCaptchaEle.text(captchaKey)
        cy.get('[name="g-recaptcha-response"]').then((gCaptchaEle) => {
          gCaptchaEle.text(captchaKey)
          cy.contains('Submit application').click()
          cy.get('h3').contains('Application submitted!')
        })
      })
    })
  })
})
