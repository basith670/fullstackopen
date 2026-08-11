import { useState } from 'react'
import styled from 'styled-components'

const Form = styled.form`
  max-width: 600px;
  margin: 30px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  gap: 18px;
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-weight: 600;
  color: #374151;
`

const Input = styled.input`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  }
`

const CreateButton = styled.button`
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  background: #16a34a;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #15803d;
  }
`

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
    <Form onSubmit={handleSubmit}>
      <Field>
        <Label htmlFor="title">
          title
        </Label>

        <Input
          id="title"
          value={title}
          onChange={({ target }) =>
            setTitle(target.value)
          }
        />
      </Field>

      <Field>
        <Label htmlFor="author">
          author
        </Label>

        <Input
          id="author"
          value={author}
          onChange={({ target }) =>
            setAuthor(target.value)
          }
        />
      </Field>

      <Field>
        <Label htmlFor="url">
          url
        </Label>

        <Input
          id="url"
          value={url}
          onChange={({ target }) =>
            setUrl(target.value)
          }
        />
      </Field>

      <CreateButton type="submit">
        create
      </CreateButton>
    </Form>
  )
}

export default BlogForm