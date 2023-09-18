const { Schema, model } = require('mongoose')
// import { Schema, model } from 'mongoose'
const uniqueValidator = require('mongoose-unique-validator')
// import uniqueValidator from 'mongoose-unique-validator'

const userSchema = new Schema({
  username: {
    type: String,
    require: true,
    unique: true,
    minLength: 3,
  },
  passwordHash: {
    type: String,
    require: true,
  },
  name: String,
  blogs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  },
})

userSchema.plugin(uniqueValidator)

const User = model('User', userSchema)

module.exports = User
