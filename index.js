require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const { response } = require('express')

const app = express()

morgan.token('object', function(req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object')) 
app.use(express.json()) 
app.use(cors())
app.use(express.static('build'))

app.get('/', (req, res) => {
    res.send('<h1>Sellanen sivu!</h1>')
})
  
app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person.countDocuments()
  .then(number =>
    res.send(
      `<p>Phone book has info on ${number} people. </p> <p>${new Date()}</p>`
      )
  )
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(person => {
    if(person) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {

  const body = request.body

  if(!body.name || !body.number) {
      return response.status(400).json({
          error: "Name or number missing!"
      })
  }

  if(persons.some(person => person.name === body.name)) {
      return response.status(400).json({
          error: "That name is already in the phone book!"
      })
  }
  
  const person = new Person({
      name: body.name,
      number: body.number,
      id: generateId()
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler) 

const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => n.id))
    : 0
  return maxId + 1
} 

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})