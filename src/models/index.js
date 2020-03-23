const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { format, differenceInMinutes } = require('date-fns')

const ScheduleSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: '{PATH} is required!',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: '{PATH} is required!',
  },
  startDay: Date,
  startLunch: Date,
  endLunch: Date,
  endDay: Date,
  workedMinutes: Number,
})

ScheduleSchema.index({ date: 1, user: 1 }, { unique: true })

ScheduleSchema.methods.serialize = function() {
  return {
    _id: this._id,
    date: format(this.date, 'yyyy-MM-dd'),
    user: this.user,
    startDay: format(this.startDay, 'yyyy-MM-dd HH:mm'),
    startLunch: format(this.startLunch, 'yyyy-MM-dd HH:mm'),
    endLunch: format(this.endLunch, 'yyyy-MM-dd HH:mm'),
    endDay: format(this.endDay, 'yyyy-MM-dd HH:mm'),
    workedMinutes: this.workedMinutes,
    __v: this.__v,
  }
}

const Schedule = mongoose.model('Schedule', ScheduleSchema)

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: '{PATH} is required!',
  },
  username: {
    type: String,
    required: '{PATH} is required!',
  },
  password: {
    type: String,
    required: '{PATH} is required!',
  },
  email: {
    type: String,
    required: '{PATH} is required!',
  },
  schedules: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
})

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.password = bcrypt.hashSync(this.password)
  }
  next()
})

UserSchema.methods.serialize = function() {
  return {
    _id: this._id,
    username: this.username,
    email: this.email,
    name: this.name,
    __v: this.__v,
  }
}

const User = mongoose.model('User', UserSchema)

module.exports.User = User
module.exports.Schedule = Schedule
