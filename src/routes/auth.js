const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { User } = require('../models')
const { jwtVerify } = require('../middlewares')

const router = express.Router()

router.post('/login', async function(req, res) {
  const user = User.findOne(
    {
      username: req.body.username,
    },
    function(err, user) {
      if (err) {
        res.status(500).json({ message: err })
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      if (!bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(401).json({ message: 'Bad Credentials' })
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: Number(process.env.JWT_EXPIRES_IN),
      })

      res.header('Authorization', `Bearer ${token}`)

      return res.json({ user: user.serialize() })
    }
  )
})

router.get('/user', jwtVerify, async function(req, res) {
  res.json({ user: req.user.serialize() })
})

module.exports = router
