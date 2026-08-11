import { render, screen, fireEvent } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import Blog from '../Blog'

describe('Blog component', () => {
  test('renders title and author, but not URL or likes by default', () => {
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

    render(
      <Blog
        blog={blog}
        updateBlog={() => {}}
        deleteBlog={() => {}}
        user={{
          username: 'basith',
          name: 'Muhammad Basith',
          id: '123'
        }}
      />
    )

    expect(
      screen.getByText('The React Test Blog Muhammad Basith')
    ).toBeInTheDocument()

    expect(
      screen.queryByText('https://example.com/react-test')
    ).not.toBeInTheDocument()

    expect(
      screen.queryByText('likes 5')
    ).not.toBeInTheDocument()
  })

  test('renders URL and likes when view button is clicked', () => {
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

    render(
      <Blog
        blog={blog}
        updateBlog={() => {}}
        deleteBlog={() => {}}
        user={{
          username: 'basith',
          name: 'Muhammad Basith',
          id: '123'
        }}
      />
    )

    const viewButton = screen.getByText('view')

    fireEvent.click(viewButton)

    expect(
      screen.getByText('https://example.com/react-test')
    ).toBeInTheDocument()

    expect(
      screen.getByText('likes 5')
    ).toBeInTheDocument()
  })

  test('calls updateBlog twice when like button is clicked twice', () => {
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

    const updateBlog = vi.fn()

    render(
      <Blog
        blog={blog}
        updateBlog={updateBlog}
        deleteBlog={() => {}}
        user={{
          username: 'basith',
          name: 'Muhammad Basith',
          id: '123'
        }}
      />
    )

    const viewButton = screen.getByText('view')

    fireEvent.click(viewButton)

    const likeButton = screen.getByText('like')

    fireEvent.click(likeButton)
    fireEvent.click(likeButton)

    expect(updateBlog).toHaveBeenCalledTimes(2)
  })
})