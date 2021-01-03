const express = require('express')
const morgan = require('morgan')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.use(express.json())

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

app.post('/api/persons', (request, response) => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0

    const person = request.body

    if (!person.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!person.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    } else if (persons.find(x => x.name === person.name)) {
        return response.status(400).json({
            error: 'name already exists'
        })
    }

    person.id = maxId + 1

    persons = persons.concat(person)

    response.json(person)
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