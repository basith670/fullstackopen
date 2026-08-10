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

// 3.13
// GET all persons from MongoDB

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => {
      console.log(error)

      response.status(500).json({
        error: 'error fetching persons'
      })
    })
})

// 3.2
// Information page

app.get('/info', (request, response) => {
  Person.countDocuments({})
    .then(count => {
      const currentTime = new Date()

      response.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${currentTime}</p>
      `)
    })
    .catch(error => {
      console.log(error)

      response.status(500).send({
        error: 'error fetching phonebook information'
      })
    })
})

// 3.3
// GET one person

app.get('/api/persons/:id', (request, response) => {
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
    .catch(error => {
      console.log(error)

      response.status(400).json({
        error: 'malformatted id'
      })
    })
})

// 3.4
// DELETE one person

app.delete('/api/persons/:id', (request, response) => {
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
    .catch(error => {
      console.log(error)

      response.status(400).json({
        error: 'malformatted id'
      })
    })
})

// 3.5 + 3.6 + 3.14
// POST a new person

app.post('/api/persons', (request, response) => {
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

  // Create new MongoDB document
  const person = new Person({
    name: body.name,
    number: body.number
  })

  person
    .save()
    .then(savedPerson => {
      response.status(201).json(savedPerson)
    })
    .catch(error => {
      console.log(error)

      response.status(500).json({
        error: 'error saving person'
      })
    })
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
// Start server
// ==================================================

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})