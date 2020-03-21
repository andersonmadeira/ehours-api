const faker = require('faker')
const dotenv = require('dotenv-safe')
dotenv.config()
const mongoose = require('mongoose')
const chalk = require('chalk')
const { User } = require('./models')

mongoose.connect(process.env.DB_CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

function logInfo(phrase) {
  console.log(chalk.bgCyan.white('INFO') + chalk.cyan(`: ${phrase}`))
}

async function generateUsers(count) {
  const userCount = count ? count : 5
  let users = []

  logInfo(`Generating ${userCount} users...`)

  for (let i = 0; i < userCount; i++) {
    const user = new User({
      name: faker.name.firstName() + ' ' + faker.name.lastName(),
      username: faker.internet.userName(),
      password: 'Senha123',
      email: faker.internet.email(),
    })

    users.push(user.save())
  }

  console.log(await Promise.all(users))

  logInfo('done!')
}

mongoose.connection.on('connected', async function(ref) {
  await generateUsers()
  mongoose.disconnect()
})
