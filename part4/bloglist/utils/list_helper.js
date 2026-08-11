const dummy = blogs => {
    return 1
  }
  
  const totalLikes = blogs => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
  }
  
  const favoriteBlog = blogs => {
    return blogs.reduce((favorite, blog) => {
      return blog.likes > favorite.likes ? blog : favorite
    })
  }
  
  const mostBlogs = blogs => {
    const blogCounts = {}
  
    blogs.forEach(blog => {
      blogCounts[blog.author] = (blogCounts[blog.author] || 0) + 1
    })
  
    return Object.entries(blogCounts).reduce(
      (most, current) => {
        if (current[1] > most.blogs) {
          return {
            author: current[0],
            blogs: current[1]
          }
        }
  
        return most
      },
      {
        author: '',
        blogs: 0
      }
    )
  }
  
  const mostLikes = blogs => {
    const authorLikes = {}
  
    blogs.forEach(blog => {
      authorLikes[blog.author] =
        (authorLikes[blog.author] || 0) + blog.likes
    })
  
    return Object.entries(authorLikes).reduce(
      (most, current) => {
        if (current[1] > most.likes) {
          return {
            author: current[0],
            likes: current[1]
          }
        }
  
        return most
      },
      {
        author: '',
        likes: 0
      }
    )
  }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }