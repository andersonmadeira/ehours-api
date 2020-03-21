const jwt = require('jsonwebtoken')
const { User } = require('../models')

const jwtVerify = function(req, res, next) {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).send({ message: 'Token Not Provided' })
  }

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, async function(
    err,
    decoded
  ) {
    if (err) {
      return res.status(401).send({ message: 'Token ' + err.message })
    }

    req.user = await User.findById({ _id: decoded.id })

    next()
  })
}

module.exports.jwtVerify = jwtVerify
