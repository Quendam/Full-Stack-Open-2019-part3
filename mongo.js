
const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

// Connect to the db
const password = process.argv[2]
const url =
    `mongodb+srv://fullstack:${password}@fullstack2019-n5b0o.mongodb.net/persons-app?retryWrites=true&w=majority`
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// List entries if we dont get 4th and 5th arguments
if( process.argv.length < 4){  
  Person
  .find({})
  .then(persons => {
    console.log("Phonebook");
    
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    })
  
    mongoose.connection.close()
  })  

// Add new entry
} else {

  const name = process.argv[3]
  const number = process.argv[4]
  
  const person = new Person({
    name: name,
    number: number,
  })
  
  person.save().then(response => {
    console.log(`Added ${response.name} number ${response.number} to phonebook`);
    mongoose.connection.close();
  })
}
