const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
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

      <div>
        author {blog.author}
      </div>

      <div>
        {blog.url}
      </div>

      <div>
        likes {blog.likes}

        {' '}

        {user && (
          <button onClick={handleLike}>
            like
          </button>
        )}
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
  )
}

export default Blog