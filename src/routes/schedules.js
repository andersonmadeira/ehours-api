const express = require('express')
const { Schedule } = require('../models')
const { differenceInMinutes } = require('date-fns')

const { jwtVerify } = require('../middlewares')

const router = express.Router()

router.use(jwtVerify)

router.get('/', async function(req, res) {
  const { min, max } = req.query
  console.log('min', min)
  console.log('max', max)
  Schedule.find({ user: req.user._id, date: { $gte: min, $lte: max } })
    .sort({
      date: 1,
    })
    .then(
      function(schedules) {
        res.send(schedules)
      },
      function(error) {
        res.status(400).send(error)
      }
    )
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
  const { date, startDay, startLunch, endLunch, endDay } = req.body
  const startDayDate = Date.parse(startDay),
    startLunchDate = Date.parse(startLunch),
    endLunchDate = Date.parse(endLunch),
    endDayDate = Date.parse(endDay)

  const workedMinutes =
    startDayDate && startLunchDate && endLunchDate && endDayDate
      ? differenceInMinutes(startLunchDate, startDayDate) +
        differenceInMinutes(endDayDate, endLunchDate)
      : 0

  const schedule = new Schedule({
    date: date,
    user: req.user._id,
    startDay: startDayDate,
    startLunch: startLunchDate,
    endLunch: endLunchDate,
    endDay: endDayDate,
    workedMinutes: workedMinutes,
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
  const { date, startDay, startLunch, endLunch, endDay } = req.body
  const startDayDate = Date.parse(startDay),
    startLunchDate = Date.parse(startLunch),
    endLunchDate = Date.parse(endLunch),
    endDayDate = Date.parse(endDay)

  const workedMinutes =
    startDayDate && startLunchDate && endLunchDate && endDayDate
      ? differenceInMinutes(startLunchDate, startDayDate) +
        differenceInMinutes(endDayDate, endLunchDate)
      : 0

  const schedule = {
    startDay: startDay,
    startLunch: startLunch,
    endLunch: endLunch,
    endDay: endDay,
    workedMinutes: workedMinutes,
  }

  Schedule.updateOne({ _id: req.params.id }, schedule, function(err, result) {
    if (err) {
      res.status(500).send(err)
    }

    res.json(result)
  })
})

module.exports = router
