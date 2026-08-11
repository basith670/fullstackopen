import { useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'

const BlogContainer = styled.div`
  max-width: 750px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`

const BlogTitle = styled.h2`
  margin-bottom: 20px;
  font-size: 2rem;
  color: #222;
`

const BlogInfo = styled.p`
  margin: 12px 0;
  color: #555;
  font-size: 1rem;
`

const BlogUrl = styled.a`
  display: block;
  margin: 15px 0;
  color: #2563eb;
  text-decoration: none;
  word-break: break-word;

  &:hover {
    text-decoration: underline;
  }
`

const LikesSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
`

const Button = styled.button`
  border: none;
  border-radius: 6px;
  padding: 9px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  background: #2563eb;
  color: white;

  &:hover {
    background: #1d4ed8;
  }
`

const DeleteButton = styled(Button)`
  background: #dc2626;
  margin-top: 15px;

  &:hover {
    background: #b91c1c;
  }
`

const BackButton = styled(Button)`
  background: #6b7280;
  margin-top: 25px;

  &:hover {
    background: #4b5563;
  }
`

const NotFound = styled.div`
  max-width: 750px;
  margin: 40px auto;
  padding: 30px;
  text-align: center;
`

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
      <NotFound>
        <p>Blog not found</p>

        <BackButton onClick={() => navigate('/')}>
          back to blogs
        </BackButton>
      </NotFound>
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
    <BlogContainer className="blog">
      <BlogTitle>
        {blog.title}
      </BlogTitle>

      <BlogInfo>
        author {blog.author}
      </BlogInfo>

      <BlogUrl
        href={blog.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {blog.url}
      </BlogUrl>

      <LikesSection>
        <BlogInfo>
          likes {blog.likes}
        </BlogInfo>

        {user && (
          <Button onClick={handleLike}>
            like
          </Button>
        )}
      </LikesSection>

      <BlogInfo>
        added by {blog.user?.name}
      </BlogInfo>

      {isOwner && (
        <DeleteButton onClick={handleDelete}>
          remove
        </DeleteButton>
      )}

      <div>
        <BackButton onClick={() => navigate('/')}>
          back to blogs
        </BackButton>
      </div>
    </BlogContainer>
  )
}

export default BlogView