const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// eslint-disable-next-line no-undef
const password = process.argv[2]

const url =
  `mongodb+srv://Admin:${password}@cluster0.wpuyh.mongodb.net/phone_book_app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if(!process.argv[3] || !process.argv[4]) {
  Person.find({}).then(result => {
    console.log('Phone book:')
    result.forEach(person => {
      console.log(person.name +' '+ person.number)
    })
    mongoose.connection.close()
  })
}
else {
  const person = new Person({
    // eslint-disable-next-line no-undef
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(() => {
    console.log(`Added ${person.name}, number: ${person.number}, to phone book`)
    mongoose.connection.close()
  })
}