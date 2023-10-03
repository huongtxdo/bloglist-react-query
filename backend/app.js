const config = require('./utils/config.js')
// const config = require('./utils/config').default
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')

const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login.js')

const middleware = require('./utils/middleware.js')

const logger = require('./utils/logger.js')
// const logger = require('./utils/logger').default
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDb')
  })
  .catch((error) => logger.error('error connecting to MongoDB', error.message))

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// For production build, we catch-all => redirect all of our server requests to /index.html
// Any request made will respond with index.html, then fetch any js resources we need
// React Router will then take over and load the appropriate view
// https://ui.dev/react-router-cannot-get-url-refresh
const path = require('path')
const buildPath = path.resolve(__dirname, 'dist')
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'))
})
//////////////////////////////////////////////////////

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.errorHandler)

module.exports = app

