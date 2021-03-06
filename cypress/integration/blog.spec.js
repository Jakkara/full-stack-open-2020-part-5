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

  describe.only('When logged in', function () {
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
    it('Can like a blog', function () {
      cy.contains('Add new entry').click()
      cy.get('#author').type('The author of the like test')
      cy.get('#title').type('The like test title')
      cy.get('#url').type('http://utu.fi')
      cy.get('#add-entry-btn').click()
      cy.contains('Show').click()
      cy.contains('Likes: 0')
      const likeButton = cy.get('.blog-like')
      likeButton.click()
      cy.contains('Likes: 1')
    })
    it('Can remove a blog', function () {
      cy.contains('Add new entry').click()
      cy.get('#author').type('The author of the remove test')
      cy.get('#title').type('The remove test title')
      cy.get('#url').type('http://utu.fi')
      cy.get('#add-entry-btn').click()
      cy.contains('Show').click()
      cy.contains('Remove?').click()
      cy.contains('The author of the remove test').should('not.exist')
    })
    it('Blogs are sorted by likes descending', function () {
      // Create three blogs with differing like counts
      ['First', 'Second', 'Third'].forEach((key, index) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:3001/api/blogs/',
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
          },
          body: {
            title: key,
            author: key,
            url: 'https://utu.fi',
            likes: index
          }
        })
      })
      // Reload frontpage to show new blogs
      cy.visit('http://localhost:3000')
      // Open all details
      cy.get('.show-details').each(element => {
        element.click()
      })
      const likeCounts = []
      cy.document().then(doc => {
        doc.querySelectorAll('.like-count').forEach(element => {
          likeCounts.push(parseInt(element.innerText.split(' ')[1]))
        })
        // Copy the original likes
        const unsorted = likeCounts.slice()
        // Sort the counts in descending order
        likeCounts.sort((a, b) => b - a)
        // Assert that the original array is equal to the sorted array
        cy.expect(unsorted).to.deep.equal(likeCounts)
      })
    })
  })
})
