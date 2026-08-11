const mongoose = require('mongoose')
const supertest = require('supertest')
const { test, before, beforeEach, after } = require('node:test')
const assert = require('node:assert')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI)
})

beforeEach(async () => {
  await User.deleteMany({})
})

test('a valid user can be created', async () => {
  const newUser = {
    username: 'testuser',
    password: 'secret123',
    name: 'Test User'
  }

  const response = await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.username, 'testuser')
  assert.strictEqual(response.body.name, 'Test User')
  assert(response.body.id)
})

test('user without username is not created', async () => {
  const newUser = {
    password: 'secret123',
    name: 'Test User'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('user without password is not created', async () => {
  const newUser = {
    username: 'testuser',
    name: 'Test User'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('username shorter than 3 characters is not created', async () => {
  const newUser = {
    username: 'ab',
    password: 'secret123',
    name: 'Test User'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('password shorter than 3 characters is not created', async () => {
  const newUser = {
    username: 'testuser',
    password: 'ab',
    name: 'Test User'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('duplicate username is not created', async () => {
  const newUser = {
    username: 'testuser',
    password: 'secret123',
    name: 'Test User'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  await api
    .post('/api/users')
    .send({
      username: 'testuser',
      password: 'anotherpassword',
      name: 'Another User'
    })
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})