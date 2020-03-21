const express = require('express')
const { User } = require('../models')

const { jwtVerify } = require('../middlewares')

const router = express.Router()

router.use(jwtVerify)

router.get('/', async function(req, res) {
  const user = await User.findById(req.user._id)
  res.send(user.schedules)
})

router.post('/', async function(req, res) {
  req.user.schedules.push({
    date: req.body.date,
    startDay: req.body.startDay,
    startLunch: req.body.startLunch,
    endLunch: req.body.endLunch,
    endDay: req.body.endDay,
  })

  const newSchedule = req.user.schedules[0]

  await req.user.save()

  res.send(newSchedule)
})

module.exports = router
