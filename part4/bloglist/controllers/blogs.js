const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})

  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id

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