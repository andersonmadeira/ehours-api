const express = require('express')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv-safe')
dotenv.config()

const { cors } = require('./middlewares')

const authRouter = require('./routes/auth')
const schedulesRouter = require('./routes/schedules')

mongoose.connect(process.env.DB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.set('useCreateIndex', true)

const app = express()
const port = process.env.PORT || 3001

app.use(helmet())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors)

app.use('/api/auth', authRouter)
app.use('/api/schedules', schedulesRouter)

app.listen(port, function() {
  console.log(`Listening on port ${port}`)
})
