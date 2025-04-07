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
  
  console.log("arg0", process.argv[0]);
  console.log("argv1", process.argv[1]);

if (process.argv.length==3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person);
      mongoose.connection.close();
    })
  })
} else {
  person.save().then(result => {
    console.log('Added', process.argv[3], 'number', process.argv[4], 'to phonebook')
    mongoose.connection.close()
  })
}