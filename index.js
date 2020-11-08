const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  response.json(person)
})

app.get('/info', (req, res) => {
  res.send(
  `<p>Phone book has info on ${persons.length} people. </p> <p>${new Date()}</p>`
  )
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
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
  
  const person = {
      name: body.name,
      number: body.number,
      id: generateId()
  }

  persons = persons.concat(person)
  return response.status(201).end()
})

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