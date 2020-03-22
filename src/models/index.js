const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const ScheduleSchema = new mongoose.Schema({
  date: {
    type: String,
    required: '{PATH} is required!',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: '{PATH} is required!',
  },
  startDay: String,
  startLunch: String,
  endLunch: String,
  endDay: String,
})

ScheduleSchema.index({ date: 1, user: 1 }, { unique: true })

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
