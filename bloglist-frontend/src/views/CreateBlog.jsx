import { Navigate, useNavigate } from 'react-router-dom'
import BlogForm from '../components/BlogForm'

const CreateBlog = ({ user, createBlog }) => {
  const navigate = useNavigate()

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  const handleCreate = async newBlog => {
    await createBlog(newBlog)
    navigate('/')
  }

  return (
    <div>
      <h2>create new blog</h2>

      <BlogForm createBlog={handleCreate} />

      <button
        type="button"
        onClick={() => navigate('/')}
      >
        cancel
      </button>
    </div>
  )
}

export default CreateBlog