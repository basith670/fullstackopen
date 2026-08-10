const express = require('express')
const morgan = require('morgan')
const path = require('path')

const app = express()

const PORT = process.env.PORT || 3001

// ==================================================
// Phonebook data
// ==================================================

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
]

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

// 3.1
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

// 3.2
app.get('/info', (request, response) => {
  const currentTime = new Date()

  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${currentTime}</p>
  `)
})

// 3.3
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const person = persons.find(
    person => person.id === id
  )

  if (person) {
    response.json(person)
  } else {
    response.status(404).json({
      error: 'person not found'
    })
  }
})

// 3.4
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id

  const personExists = persons.some(
    person => person.id === id
  )

  if (!personExists) {
    return response.status(404).json({
      error: 'person not found'
    })
  }

  persons = persons.filter(
    person => person.id !== id
  )

  response.status(204).end()
})

// 3.5 + 3.6
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const nameExists = persons.some(
    person =>
      person.name.toLowerCase() ===
      body.name.toLowerCase()
  )

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const newPerson = {
    id: Math.random()
      .toString(36)
      .substring(2, 10),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)

  response.status(201).json(newPerson)
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