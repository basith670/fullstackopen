require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const path = require('path')
const mongoose = require('mongoose')

const Person = require('./models/person')

const app = express()

const PORT = process.env.PORT || 3001

// ==================================================
// MongoDB connection
// ==================================================

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log(
      'error connecting to MongoDB:',
      error.message
    )
  })

// ==================================================
// Middleware
// ==================================================

app.use(express.json())

// ==================================================
// Morgan logging
// ==================================================

morgan.token('body', request => {
  return JSON.stringify(request.body)
})

app.use(
  morgan((tokens, request, response) => {
    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, 'content-length'),
      '-',
      tokens['response-time'](request, response),
      'ms',
      'body:',
      tokens.body(request, response)
    ].join(' ')
  })
)

// ==================================================
// API routes
// ==================================================

// ==================================================
// 3.13
// GET all persons from MongoDB
// ==================================================

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

// ==================================================
// 3.18
// GET phonebook information
// ==================================================

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()

      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch(error => next(error))
})

// ==================================================
// 3.18
// GET one person
// ==================================================

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).json({
          error: 'person not found'
        })
      }
    })
    .catch(error => next(error))
})

// ==================================================
// 3.15
// DELETE one person
// ==================================================

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id)
    .then(person => {
      if (!person) {
        return response.status(404).json({
          error: 'person not found'
        })
      }

      response.status(204).end()
    })
    .catch(error => next(error))
})

// ==================================================
// 3.14
// POST a new person
// ==================================================

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Check that name exists
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  // Check that number exists
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})

// ==================================================
// 3.17
// PUT - update an existing person
// ==================================================

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  const { name, number } = request.body

  Person.findById(id)
    .then(person => {
      if (!person) {
        return response.status(404).json({
          error: 'person not found'
        })
      }

      person.name = name
      person.number = number

      return person.save()
    })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson)
      }
    })
    .catch(error => next(error))
})

// ==================================================
// Serve React production build
// ==================================================

app.use(
  express.static(
    path.join(__dirname, 'dist')
  )
)

// ==================================================
// Unknown endpoint
// ==================================================

app.use((request, response) => {
  response.status(404).json({
    error: 'unknown endpoint'
  })
})

// ==================================================
// 3.16
// Error handler middleware
// ==================================================

const errorHandler = (
  error,
  request,
  response,
  next
) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({
      error: 'malformatted id'
    })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)

// ==================================================
// Start server
// ==================================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})