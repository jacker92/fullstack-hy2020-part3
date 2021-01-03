const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

const Person = require('./mongo.js')

const app = express()

morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body'));

app.get('/info', async (req, res) => {
    const persons = await Person.find({});
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

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        return response.json(person)
    }).catch(x => next(x))
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    } else if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    //   else if (persons.find(x => x.name === body.name)) {
    //     return response.status(400).json({
    //        error: 'name already exists'
    // })
    //}

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(person => {
        return response.json(person)
    })
    .catch(x => next(x))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})