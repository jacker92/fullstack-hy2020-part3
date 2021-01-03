const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI
   
console.log(url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
const personSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    number: {type: String, required: true, unique: false},
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

personSchema.plugin(validator);

module.exports = mongoose.model('Person', personSchema);