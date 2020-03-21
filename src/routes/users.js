const express = require('express')
const { User } = require('../models')

const router = express.Router()

router.get('/', async function(req, res) {
  User.find().then(
    users => {
      res.json(users)
    },
    error => {
      res.json({ message: error })
    }
  )
})

router.get('/:id', function(req, res) {
  const { id } = req.params

  User.findById(id, function(err, user) {
    if (err) {
      res.status(500).send(err)
    }

    res.json(user)
  })
})

module.exports = router
