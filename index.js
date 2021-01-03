const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./mongo.js')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.get('/info', (req, res) => {
    res.send(
        `<p>
        Phonebook has info for ${persons.length} people
        </p>
        <p>${new Date()}</p>`
    )
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(x => res.json(x))
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        return response.json(person)
    }).catch(x => {
        console.log("Error", x);
        return response.status(404).end();
    }
    )
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

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})