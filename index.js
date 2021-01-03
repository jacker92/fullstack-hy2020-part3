const express = require('express')
const app = express()

let persons = [
    {
        "name": "Mariette Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    },
    {
        "name": "Tester Testi",
        "number": "39-23-1111",
        "id": 1
    },
]

app.get('/info', (req, res) => {
    res.send(
        `<p>
        Phonebook has info for ${persons.length} people
        </p>
        <p>${new Date()}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    response.status(204).end()
  })

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})