const blogsRouter = require('express').Router()

const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const blog = new Blog({
    ...request.body,
    user: request.user._id
  })

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id)

  if (!blog) {
    return response.status(404).json({
      error: 'blog not found'
    })
  }

  if (blog.user.toString() !== request.user._id.toString()) {
    return response.status(403).json({
      error: 'user not authorized to delete this blog'
    })
  }

  await Blog.findByIdAndDelete(id)

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const id = request.params.id

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      request.body,
      {
        returnDocument: 'after',
        runValidators: true
      }
    )

    if (!updatedBlog) {
      return response.status(404).json({
        error: 'blog not found'
      })
    }

    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter