import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom'

import BlogList from './views/BlogList'
import BlogView from './views/BlogView'
import Login from './views/Login'
import CreateBlog from './views/CreateBlog'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  // --------------------------------------------------
  // Load logged-in user and blogs
  // --------------------------------------------------

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
    }

    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  // --------------------------------------------------
  // Notification timeout
  // --------------------------------------------------

  useEffect(() => {
    if (notification === null) {
      return
    }

    const timeoutId = setTimeout(() => {
      setNotification(null)
    }, 5000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [notification])

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  const handleLogin = async event => {
    event.preventDefault()

    const credentials = {
      username,
      password
    }

    try {
      const loggedInUser =
        await loginService.login(credentials)

      localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser)
      )

      setUser(loggedInUser)

      setUsername('')
      setPassword('')

      setNotification({
        message: 'Login successful',
        type: 'success'
      })

      navigate('/')
    } catch {
      setNotification({
        message: 'Wrong username or password',
        type: 'error'
      })
    }
  }

  // --------------------------------------------------
  // Logout
  // --------------------------------------------------

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogappUser')

    setUser(null)

    navigate('/')
  }

  // --------------------------------------------------
  // Create blog
  // --------------------------------------------------

  const handleCreateBlog = async newBlog => {
    if (!user) {
      return
    }

    try {
      const createdBlog = await blogService.create(
        newBlog,
        user.token
      )

      setBlogs(blogs.concat(createdBlog))

      setNotification({
        message: `a new blog "${createdBlog.title}" by ${createdBlog.author} added`,
        type: 'success'
      })

      navigate('/')

      return createdBlog
    } catch {
      setNotification({
        message: 'Failed to create blog',
        type: 'error'
      })

      throw new Error('Failed to create blog')
    }
  }

  // --------------------------------------------------
  // Like blog
  // --------------------------------------------------

  const handleUpdateBlog = async (id, updatedBlog) => {
    if (!user) {
      return
    }

    try {
      const returnedBlog = await blogService.update(
        id,
        updatedBlog,
        user.token
      )

      setBlogs(
        blogs.map(blog =>
          blog.id === id
            ? returnedBlog
            : blog
        )
      )

      setNotification({
        message: `blog "${returnedBlog.title}" liked`,
        type: 'success'
      })
    } catch {
      setNotification({
        message: 'Failed to update blog',
        type: 'error'
      })
    }
  }

  // --------------------------------------------------
  // Delete blog
  // --------------------------------------------------

  const handleDeleteBlog = async blog => {
    if (!user) {
      return
    }

    const confirmDelete = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}?`
    )

    if (!confirmDelete) {
      return
    }

    try {
      await blogService.remove(
        blog.id,
        user.token
      )

      setBlogs(
        blogs.filter(b => b.id !== blog.id)
      )

      setNotification({
        message: `blog "${blog.title}" removed`,
        type: 'success'
      })

      navigate('/')
    } catch {
      setNotification({
        message: 'Failed to remove blog',
        type: 'error'
      })
    }
  }

  // --------------------------------------------------
  // Application
  // --------------------------------------------------

  return (
    <div>
      <h1>Bloglist</h1>

      {/* Navigation */}

      <nav>
        <Link to="/">
          blogs
        </Link>

        {' '}

        {!user && (
          <Link to="/login">
            login
          </Link>
        )}

        {user && (
          <>
            <Link to="/create">
              create new blog
            </Link>

            {' '}

            <span>
              {user.name} logged in
            </span>

            {' '}

            <button onClick={handleLogout}>
              logout
            </button>
          </>
        )}
      </nav>

      {/* Notification */}

      {notification && (
        <div>
          {notification.message}
        </div>
      )}

      {/* Routes */}

      <Routes>

        {/* Blog list */}

        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
            />
          }
        />

        {/* Single blog */}

        <Route
          path="/blogs/:id"
          element={
            <BlogView
              blogs={blogs}
              updateBlog={handleUpdateBlog}
              deleteBlog={handleDeleteBlog}
              user={user}
            />
          }
        />

        {/* Create blog */}

        <Route
          path="/create"
          element={
            user ? (
              <CreateBlog
                user={user}
                createBlog={handleCreateBlog}
              />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* Login */}

        <Route
          path="/login"
          element={
            user ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <Login
                username={username}
                password={password}
                handleUsernameChange={setUsername}
                handlePasswordChange={setPassword}
                handleLogin={handleLogin}
                notification={notification}
              />
            )
          }
        />

      </Routes>
    </div>
  )
}

export default App