import React, { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import AddForm from './components/AddForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'
import Togglable from './components/Toggleable'

const App = () => {
  const [notificationMessage, setNotificationMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loginVisible, setLoginVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const addFormRef = useRef()

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

  const showTimedMessage = (message, timeout) => {
    setNotificationMessage(message)
    setTimeout(() => setNotificationMessage(null), timeout)
  }

  const showTimedErrorMessage = (message, timeout) => {
    setErrorMessage(message)
    setTimeout(() => setErrorMessage(null), timeout)
  }

  const onSuccess = message => {
    showTimedMessage(message, 2000)
  }

  const onError = message => {
    showTimedErrorMessage(message, 2000)
  }

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

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <>
      {notificationMessage ? (
        <Notification message={notificationMessage} className="success" />
      ) : ''}
      {errorMessage ? (
        <Notification message={errorMessage} className="error" />
      ) : ''}
      {user === null
        ? loginForm()
        : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h4> Signed in as: {user.name}</h4>
              <button onClick={handleLogout}>Log out</button>
            </div>
            <Togglable buttonLabel="Add new entry" ref={addFormRef}>
              <AddForm
                onSuccess={onSuccess}
                onError={onError}
                visibilityRef={addFormRef}
              />
            </Togglable>
            <BlogList blogs={blogs} />
          </>
        )
      }
    </>
  )
}

export default App
