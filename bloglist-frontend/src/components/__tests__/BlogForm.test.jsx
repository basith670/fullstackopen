import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import BlogForm from '../BlogForm'

describe('BlogForm component', () => {
  test('calls createBlog with the correct details when a new blog is created', async () => {
    const createBlog = vi.fn()

    render(
      <BlogForm createBlog={createBlog} />
    )

    const titleInput = screen.getByLabelText('title')
    const authorInput = screen.getByLabelText('author')
    const urlInput = screen.getByLabelText('url')

    fireEvent.change(titleInput, {
      target: {
        value: 'The React Test Blog'
      }
    })

    fireEvent.change(authorInput, {
      target: {
        value: 'Muhammad Basith'
      }
    })

    fireEvent.change(urlInput, {
      target: {
        value: 'https://example.com/react-test'
      }
    })

    fireEvent.click(screen.getByText('create'))

    await waitFor(() => {
      expect(createBlog).toHaveBeenCalledWith({
        title: 'The React Test Blog',
        author: 'Muhammad Basith',
        url: 'https://example.com/react-test'
      })
    })
  })
})