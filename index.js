require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(bodyParser.json())
app.use(cors())
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(express.static('build'))

let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": 1
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": 2
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": 3
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Elli Esimerkki",
    "number": "321-123456",
    "id": 5
  }
]

// app.get('/', (req, res) => {
//   res.send('<h1>Hello World!</h1>')
// })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(person => person.toJSON()))
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  // const found = persons.filter(entry => entry.name === person.name)

  if(!body.name){
    return res.status(404).json({
      error: 'Name is missing'
    })
  }
  
  if(!body.number){
    return res.status(404).json({
      error: 'Number is missing'
    })
  }

  // if(found.length){
  //   return res.status(404).json({
  //     error: 'Name must be unique'
  //   }) 
  // }


  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save().then(response => {
    console.log(`Added ${response.name} number ${response.number} to phonebook`);
    res.json(response);
  })
  .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.reduce((prev, current) => current.id === id ? current : prev
  , null)

  if(person === null) {
    res.status(404).end()
  } else {
    res.json(person)
  }
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
  .then(result => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

app.get('/info', (req, res) => {
  let now = new Date()
  let html = `<p>Phonebook has info for ${persons.length} people</p>`
  html += `<p>${now}</p>`
  res.send(html)
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: error.message })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})