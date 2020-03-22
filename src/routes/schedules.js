const express = require('express')
const { User, Schedule } = require('../models')

const { jwtVerify } = require('../middlewares')

const router = express.Router()

router.use(jwtVerify)

router.get('/', async function(req, res) {
  Schedule.find({ user: req.user._id }, function(err, schedules) {
    if (err) {
      res.status(400).send(err)
      return
    }

    res.send(schedules)
  })
})

router.get('/:id', function(req, res) {
  const { id } = req.params

  Schedule.findById(id, function(err, schedule) {
    if (err) {
      res.status(500).send(err)
    }

    res.json(schedule)
  })
})

router.post('/', async function(req, res) {
  const schedule = new Schedule({
    date: req.body.date,
    user: req.user._id,
    startDay: req.body.startDay,
    startLunch: req.body.startLunch,
    endLunch: req.body.endLunch,
    endDay: req.body.endDay,
  })

  schedule.save().then(
    schedule => {
      res.send(schedule)
    },
    error => {
      res.status(500).send(error)
    }
  )
})

router.patch('/:id', async function(req, res) {
  const schedule = {
    startDay: req.body.startDay,
    startLunch: req.body.startLunch,
    endLunch: req.body.endLunch,
    endDay: req.body.endDay,
  }

  Schedule.updateOne({ _id: req.params.id }, schedule, function(err, result) {
    if (err) {
      res.status(500).send(err)
    }

    res.json(result)
  })
})

module.exports = router
