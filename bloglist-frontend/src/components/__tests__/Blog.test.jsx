import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Blog from '../Blog'

const blog = {
  title: 'The React Test Blog',
  author: 'Muhammad Basith',
  url: 'https://example.com/react-test',
  likes: 5,
  user: {
    username: 'basith',
    name: 'Muhammad Basith',
    id: '123'
  }
}

describe('Blog component', () => {
  test('unauthenticated user sees blog information but no buttons', () => {
    render(
      <Blog
        blog={blog}
        updateBlog={() => {}}
        deleteBlog={() => {}}
        user={null}
      />
    )

    expect(
      screen.getByText('The React Test Blog')
    ).toBeInTheDocument()

    expect(
      screen.getByText('author Muhammad Basith')
    ).toBeInTheDocument()

    expect(
      screen.getByText('https://example.com/react-test')
    ).toBeInTheDocument()

    expect(
      screen.getByText('likes 5')
    ).toBeInTheDocument()

    expect(
      screen.getByText('added by Muhammad Basith')
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'like' })
    ).not.toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'remove' })
    ).not.toBeInTheDocument()
  })

  test('authenticated user who is not the creator sees only the like button', () => {
    render(
      <Blog
        blog={blog}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
        user={{
          username: 'anotheruser',
          name: 'Another User',
          id: '456'
        }}
      />
    )

    expect(
      screen.getByText('The React Test Blog')
    ).toBeInTheDocument()

    expect(
      screen.getByText('author Muhammad Basith')
    ).toBeInTheDocument()

    expect(
      screen.getByText('https://example.com/react-test')
    ).toBeInTheDocument()

    expect(
      screen.getByText('likes 5')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'like' })
    ).toBeInTheDocument()

    expect(
      screen.queryByRole('button', { name: 'remove' })
    ).not.toBeInTheDocument()
  })

  test('the creator sees both like and delete buttons', () => {
    render(
      <Blog
        blog={blog}
        updateBlog={vi.fn()}
        deleteBlog={vi.fn()}
        user={{
          username: 'basith',
          name: 'Muhammad Basith',
          id: '123'
        }}
      />
    )

    expect(
      screen.getByText('The React Test Blog')
    ).toBeInTheDocument()

    expect(
      screen.getByText('author Muhammad Basith')
    ).toBeInTheDocument()

    expect(
      screen.getByText('https://example.com/react-test')
    ).toBeInTheDocument()

    expect(
      screen.getByText('likes 5')
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'like' })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', { name: 'remove' })
    ).toBeInTheDocument()
  })
})