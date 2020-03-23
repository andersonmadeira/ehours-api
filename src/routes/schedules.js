const express = require('express')
const { Schedule } = require('../models')
const { differenceInMinutes } = require('date-fns')

const { jwtVerify } = require('../middlewares')

const { parse } = require('date-fns')

const router = express.Router()

router.use(jwtVerify)

router.get('/', async function(req, res) {
  const { min, max } = req.query
  Schedule.find({ user: req.user._id, date: { $gte: min, $lte: max } })
    .sort({
      date: 1,
    })
    .then(
      function(schedules) {
        res.send(schedules.map(s => s.serialize()))
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

    res.json(schedule.serialize())
  })
})

router.post('/', async function(req, res) {
  const date = parse(req.body.date, 'yyyy-MM-dd', new Date()),
    startDayDate = parse(req.body.startDay, 'yyyy-MM-dd HH:mm', new Date()),
    startLunchDate = parse(req.body.startLunch, 'yyyy-MM-dd HH:mm', new Date()),
    endLunchDate = parse(req.body.endLunch, 'yyyy-MM-dd HH:mm', new Date()),
    endDayDate = parse(req.body.endDay, 'yyyy-MM-dd HH:mm', new Date())

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
      res.send(schedule.serialize())
    },
    error => {
      res.status(500).send(error)
    }
  )
})

router.patch('/:id', async function(req, res) {
  const date = parse(req.body.date, 'yyyy-MM-dd'),
    startDayDate = parse(req.body.startDay, 'yyyy-MM-dd HH:mm'),
    startLunchDate = parse(req.body.startLunch, 'yyyy-MM-dd HH:mm'),
    endLunchDate = parse(req.body.endLunch, 'yyyy-MM-dd HH:mm'),
    endDayDate = parse(req.body.endDay, 'yyyy-MM-dd HH:mm')

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
