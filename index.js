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

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})