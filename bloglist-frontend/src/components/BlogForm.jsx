import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    await createBlog({
      title,
      author,
      url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">title</label>
        <input
          id="title"
          value={title}
          onChange={({ target }) =>
            setTitle(target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="author">author</label>
        <input
          id="author"
          value={author}
          onChange={({ target }) =>
            setAuthor(target.value)
          }
        />
      </div>

      <div>
        <label htmlFor="url">url</label>
        <input
          id="url"
          value={url}
          onChange={({ target }) =>
            setUrl(target.value)
          }
        />
      </div>

      <button type="submit">
        create
      </button>
    </form>
  )
}

export default BlogForm