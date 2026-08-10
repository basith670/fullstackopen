require('dotenv').config()

const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = process.env.MONGODB_URI.replace(
  '<password>',
  password
)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 4) {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')

      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`)
      })

      mongoose.connection.close()
    })
    .catch(error => {
      console.error(error)
      mongoose.connection.close()
    })

  mongoose.connect(url)
} else {
  const person = new Person({
    name: name,
    number: number
  })

  mongoose
    .connect(url)
    .then(() => {
      return person.save()
    })
    .then(() => {
      console.log(
        `added ${name} number ${number} to phonebook`
      )

      return mongoose.connection.close()
    })
    .catch(error => {
      console.error(error)
      mongoose.connection.close()
    })
}