import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [notification, setNotification] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)
      setUser(loggedUser)
    }

    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

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
    } catch {
      setNotification({
        message: 'Wrong username or password',
        type: 'error'
      })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const handleCreateBlog = async newBlog => {
    try {
      const createdBlog = await blogService.create(
        newBlog,
        user.token
      )

      setBlogs(blogs.concat(createdBlog))
      setShowForm(false)

      setNotification({
        message: `a new blog "${createdBlog.title}" by ${createdBlog.author} added`,
        type: 'success'
      })
    } catch {
      setNotification({
        message: 'Failed to create blog',
        type: 'error'
      })
    }
  }

  const handleUpdateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(
        id,
        updatedBlog,
        user.token
      )

      setBlogs(
        blogs.map(blog =>
          blog.id === id ? returnedBlog : blog
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

  const handleDeleteBlog = async blog => {
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
    } catch {
      setNotification({
        message: 'Failed to remove blog',
        type: 'error'
      })
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        {notification && (
          <div>
            {notification.message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) =>
                setUsername(target.value)
              }
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) =>
                setPassword(target.value)
              }
            />
          </div>

          <button type="submit">
            login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      {notification && (
        <div>
          {notification.message}
        </div>
      )}

      <p>
        {user.name} logged in
        {' '}
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      {!showForm && (
        <button onClick={() => setShowForm(true)}>
          create new blog
        </button>
      )}

      {showForm && (
        <div>
          <h3>create new</h3>

          <BlogForm createBlog={handleCreateBlog} />

          <button
            type="button"
            onClick={() => setShowForm(false)}
          >
            cancel
          </button>
        </div>
      )}

      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={handleUpdateBlog}
            deleteBlog={handleDeleteBlog}
            user={user}
          />
        )}
    </div>
  )
}

export default App