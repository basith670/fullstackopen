import { useNavigate, useParams } from 'react-router-dom'

const BlogView = ({
  blogs,
  updateBlog,
  deleteBlog,
  user
}) => {
  const { id } = useParams()
  const navigate = useNavigate()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog) {
    return (
      <div>
        <p>Blog not found</p>

        <button onClick={() => navigate('/')}>
          back to blogs
        </button>
      </div>
    )
  }

  const handleLike = async () => {
    if (!user) {
      return
    }

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user
    }

    await updateBlog(blog.id, updatedBlog)
  }

  const isOwner =
    blog.user?.username === user?.username

  const handleDelete = () => {
    if (!user) {
      return
    }

    deleteBlog(blog)
  }

  return (
    <div className="blog">
      <h2>
        {blog.title}
      </h2>

      <p>
        author {blog.author}
      </p>

      <p>
        {blog.url}
      </p>

      <p>
        likes {blog.likes}
      </p>

      {user && (
        <button onClick={handleLike}>
          like
        </button>
      )}

      <p>
        added by {blog.user?.name}
      </p>

      {isOwner && (
        <button onClick={handleDelete}>
          remove
        </button>
      )}

      <div>
        <button onClick={() => navigate('/')}>
          back to blogs
        </button>
      </div>
    </div>
  )
}

export default BlogView