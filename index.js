const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})
app.get('/info', (request, response) => {
  response.send('<p>Phonebook has info for ' + JSON.stringify(persons.length) +
   ' people<br/>' +  new Date().toDateString())
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const generateId = () => {
  const id = persons.length > 0 
    ? Math.max(...persons.map(n => n.id))+1
    : 0
  return id.toString();
}

app.post('/api/persons', (request, response) => {
  const body = request.body;
  const existingPerson = persons.includes(p => p.name === request.body.name)
  
  if (!request.body.name) {
    return response.status(400).json({
      error: "name missing"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }
  
  if (existingPerson) {
    return response.status(400).json({
      error: "name must be unique"
    })
  }
  if (person.name.length === 0) {
    return response.status(400).json({
      error: "name missing"
    })
  }
  if (person.number.length === 0) {
    return response.status(400).json({
      error: "number missing"
    })
  }
  persons = persons.concat(person)
  response.json(person)
})

app.use(morgan('tiny'));

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})