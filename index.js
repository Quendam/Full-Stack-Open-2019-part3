const express = require('express')
const app = express()

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

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.reduce((prev, current) => current.id === id ? current : prev
  , null)

  if(person === null) {
    res.status(404).end();
  } else {
    res.json(person)
  }
})

app.get('/info', (req, res) => {
  let now = new Date()
  let html = `<p>Phonebook has info for ${persons.length} people</p>`
  html += `<p>${now}</p>`
  res.send(html)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})