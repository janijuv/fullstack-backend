require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
// app.use(express.static('dist'))
app.use(express.json())

const PORT = process.env.PORT
const mongoose = require('mongoose')
const person = require('./models/person')
const password = process.argv[2]

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})
app.get('/info', (request, response, next) => {
  Person.estimatedDocumentCount().then(count => {
    response.send(`
      <div><h3>Phonebook has info for ${count} persons</h3></div>
      <p>${Date()}</p></div>`)
    }).catch(error => next(error));
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(p => {
    response.json(p)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
  const id = persons.length > 0 
    ? Math.max(...persons.map(n => n.id))+1
    : 0
  return id.toString();
}

app.post('/api/persons', (request, response, next) => {
  if (!request.body.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }
  if (request.body.name.length === 0) {
    return response.status(400).json({
      error: "name missing"
    })
  }
  if (request.body.name.length < 3) {
    console.log("lt 3");
    console.log(request.error)
    return response.status(400).json({
      error: "name too short"
    })
  }
  if (request.body.number.length === 0) {
    return response.status(400).json({
      error: "number missing"
    })
  }
  const p = new Person({
    name: request.body.name,
    number: request.body.number,
    id: generateId
  })

  p.save().then(savedPerson => {
    response.json(savedPerson);
  })
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  console.log(request)
  const {name, number} = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }
      person.name = name
      person.number = number
      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error));
  })
  
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint'})
}

const errorhandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name == 'CastError') {
    return response.status(400).send({error: 'malformatted id'})
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })  
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorhandler)
app.use(morgan('tiny'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})