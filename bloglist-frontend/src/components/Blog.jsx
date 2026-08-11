import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false)

  const handleLike = async () => {
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
    deleteBlog(blog)
  }

  return (
    <div>
      <div>
        {blog.title} {blog.author}
        {' '}

        <button
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>

      {showDetails && (
        <div>
          <div>
            {blog.url}
          </div>

          <div>
            likes {blog.likes}
            {' '}

            <button onClick={handleLike}>
              like
            </button>
          </div>

          <div>
            added by {blog.user?.name}
          </div>

          {isOwner && (
            <div>
              <button onClick={handleDelete}>
                remove
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog