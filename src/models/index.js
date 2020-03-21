const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const ObjectId = mongoose.Schema.Types.ObjectId

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
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
