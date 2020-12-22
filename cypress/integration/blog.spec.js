describe('Blog app', function () {
  const user = {
    name: 'Cypress User',
    username: 'logintest',
    password: '123'
  }
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.contains('log in')
  })
  describe('Login', function () {
    it('Success with correct credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('logintest')
      cy.get('#password').type('123')
      cy.get('#login-btn').click()
      cy.contains('Signed in')
      cy.contains(user.name)
    })
    it('Fails with wrong credentials', function () {
      cy.contains('log in').click()
      cy.get('#username').type('wrong-name')
      cy.get('#password').type('not-the-right-password')
      cy.get('#login-btn').click()
      cy.contains('Wrong username or password')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function () {
      cy.login({ username: user.username, password: user.password })
    })
    it('Can create a blog', function () {
      cy.contains('Add new entry').click()
      cy.get('#author').type('The author')
      cy.get('#title').type('The title')
      cy.get('#url').type('http://utu.fi')
      cy.get('#add-entry-btn').click()
      cy.contains('Added blog entry')
      cy.contains('The author')
    })
  })
})
