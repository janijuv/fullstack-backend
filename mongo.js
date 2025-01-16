const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://janifullstack:${password}@clusterfullstack.k2no8.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=ClusterFullstack`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({ 
    "name": process.argv[3], 
    "number": process.argv[4],
  })


person.save().then(result => {
  console.log('Added', process.argv[3], 'number', process.argv[4], 'to phonebook')
  mongoose.connection.close()
})