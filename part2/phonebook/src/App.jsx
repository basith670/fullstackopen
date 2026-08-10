import { useEffect, useState } from 'react'
import personsService from './services/persons'

const Notification = ({ message, type }) => {
  if (!message) {
    return null
  }

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  )
}

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <div>
      filter shown with{' '}
      <input
        value={filter}
        onChange={handleFilterChange}
      />
    </div>
  )
}

const PersonForm = ({
  addPerson,
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, deletePerson }) => {
  return (
    <div className="person">
      <span>
        {person.name} {person.number}
      </span>

      <button onClick={() => deletePerson(person.id)}>
        delete
      </button>
    </div>
  )
}

const Persons = ({ persons, deletePerson }) => {
  return (
    <div>
      {persons.map(person => (
        <Person
          key={person.id}
          person={person}
          deletePerson={deletePerson}
        />
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

  const [notification, setNotification] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  const showNotification = (message, type) => {
    setNotification(message)
    setNotificationType(type)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
      .catch(error => {
        console.error(error)

        showNotification(
          'Unable to load phonebook data',
          'error'
        )
      })
  }, [])

  const addPerson = event => {
    event.preventDefault()

    const existingPerson = persons.find(
      person =>
        person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const replace = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (!replace) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personsService
        .update(existingPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(
            persons.map(person =>
              person.id === existingPerson.id
                ? returnedPerson
                : person
            )
          )

          setNewName('')
          setNewNumber('')

          showNotification(
            `${returnedPerson.name} number was updated`,
            'success'
          )
        })
        .catch(error => {
          console.error(error)

          showNotification(
            `${existingPerson.name} was already removed from the server`,
            'error'
          )
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))

        setNewName('')
        setNewNumber('')

        showNotification(
          `${returnedPerson.name} added to phonebook`,
          'success'
        )
      })
      .catch(error => {
        console.error(error)

        showNotification(
          'Failed to add person to phonebook',
          'error'
        )
      })
  }

  const deletePerson = id => {
    const person = persons.find(person => person.id === id)

    if (!person) {
      return
    }

    const confirmDelete = window.confirm(
      `Delete ${person.name}?`
    )

    if (!confirmDelete) {
      return
    }

    personsService
      .remove(id)
      .then(() => {
        setPersons(
          persons.filter(person => person.id !== id)
        )

        showNotification(
          `${person.name} was removed`,
          'success'
        )
      })
      .catch(error => {
        console.error(error)

        showNotification(
          `${person.name} was already removed from the server`,
          'error'
        )
      })
  }

  const handleNameChange = event => {
    setNewName(event.target.value)
  }

  const handleNumberChange = event => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = event => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  return (
    <div className="app">
      <h1>Phonebook</h1>

      <Notification
        message={notification}
        type={notificationType}
      />

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h2>Add a new</h2>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App