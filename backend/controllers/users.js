const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })

  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })

  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  const checkUsername = await User.findOne({ username })
  if (checkUsername) {
    return response.status(400).json({ error: 'existingUsername' }).end()
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({
        error: 'passwordMinLength3',
      })
      .end()
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({ username, passwordHash, name })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter

