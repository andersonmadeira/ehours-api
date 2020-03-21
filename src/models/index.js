const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const ScheduleSchema = new mongoose.Schema({
  date: String,
  startDay: String,
  startLunch: String,
  endLunch: String,
  endDay: String,
})

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  schedules: [ScheduleSchema],
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
