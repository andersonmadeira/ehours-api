const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv-safe')
dotenv.config()

const usersRouter = require('./routes/users')

mongoose.connect(process.env.DB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const app = express()
const port = process.env.PORT || 3001

app.use(helmet())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/users', usersRouter)

app.get('/', function(req, res) {
  res.send('Hello world!')
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`)
})
