import React, { useState, useEffect } from 'react'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [notificationMessage, setNotificationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const showTimedMessage = (message, timeout) => {
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(null), timeout)
  }

  const showTimedErrorMessage = (message, timeout) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), timeout)
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const userJSON = localStorage.getItem('user')
    if (userJSON) {
      const user = JSON.parse(localStorage.getItem('user'))
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      localStorage.setItem(
        'user', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      showTimedMessage('Logged in', 2000)
      setUsername('')
      setPassword('')
    } catch (e) {
      showTimedErrorMessage('Wrong username or password', 4000)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  const AddForm = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = async event => {
      event.preventDefault()
      try {
        await blogService.create({
          title, author, url
        })
        showTimedMessage(`Added blog entry: ${title}`, 2000)
      } catch (e) {
        // TODO message
        showTimedErrorMessage('Error adding blog entry', 2000)
      }
    }

    return (
      <div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input name="title" value={title} onChange={({ target }) => setTitle(target.value)} /><br />
          <label htmlFor="author">Author</label>
          <input name="author" value={author} onChange={({ target }) => setAuthor(target.value)} /><br />
          <label htmlFor="url">URL</label>
          <input name="url" value={url} onChange={({ target }) => setUrl(target.value)} /><br />
          <button type="submit">Create</button>
        </form>
      </div>
    )
  }

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="Username">Username</label>
          <input value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          <label htmlFor="Password">Password</label>
          <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )

  return (
    <>
      {notificationMessage ? (
        <Notification message={notificationMessage} className="success" />
      ) : ''}
      {errorMessage ? (
        <Notification message={errorMessage} className="error" />
      ) : ''}
      {user === null ? loginForm() : (
        <>
          <span>{user.name}</span>
          <button onClick={handleLogout}>Log out</button>
          <AddForm />
          <BlogList blogs={blogs} />
        </>
      )
      }
    </>
  )
}

export default App
