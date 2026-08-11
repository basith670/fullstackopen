import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate
} from 'react-router-dom'
import styled from 'styled-components'

import BlogList from './views/BlogList'
import BlogView from './views/BlogView'
import Login from './views/Login'
import CreateBlog from './views/CreateBlog'

import blogService from './services/blogs'
import loginService from './services/login'

// ==================================================
// Styled components
// ==================================================

const AppContainer = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
  font-family: Arial, Helvetica, sans-serif;
  color: #1f2937;
`

const AppTitle = styled.h1`
  margin-bottom: 20px;
  color: #111827;
`

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  margin-bottom: 24px;
  background: #1f2937;
  border-radius: 10px;
`

const NavLink = styled(Link)`
  padding: 8px 12px;
  border-radius: 6px;
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.2s;

  &:hover {
    background: #374151;
  }
`

const UserInfo = styled.span`
  margin-left: auto;
  color: #d1d5db;
  font-size: 14px;
`

const LogoutButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #ef4444;
  border-radius: 6px;
  background: transparent;
  color: #fca5a5;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #ef4444;
    color: #ffffff;
  }
`

const Notification = styled.div`
  margin-bottom: 20px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ $type }) =>
    $type === 'error'
      ? '#fee2e2'
      : '#dcfce7'};
  color: ${({ $type }) =>
    $type === 'error'
      ? '#991b1b'
      : '#166534'};
  border: 1px solid
    ${({ $type }) =>
      $type === 'error'
        ? '#fecaca'
        : '#bbf7d0'};
  font-weight: 500;
`

// ==================================================
// App
// ==================================================

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
    <AppContainer>
      <AppTitle>Bloglist</AppTitle>

      {/* Navigation */}

      <Navigation>
        <NavLink to="/">
          blogs
        </NavLink>

        {!user && (
          <NavLink to="/login">
            login
          </NavLink>
        )}

        {user && (
          <>
            <NavLink to="/create">
              create new blog
            </NavLink>

            <UserInfo>
              {user.name} logged in
            </UserInfo>

            <LogoutButton onClick={handleLogout}>
              logout
            </LogoutButton>
          </>
        )}
      </Navigation>

      {/* Notification */}

      {notification && (
        <Notification $type={notification.type}>
          {notification.message}
        </Notification>
      )}

      {/* Routes */}

      <Routes>
        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
            />
          }
        />

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
    </AppContainer>
  )
}

export default App