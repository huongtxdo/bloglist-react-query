// import { listen } from './app.js'
// import { PORT } from './utils/config.js'
// import { info } from './utils/logger.js'

// listen(PORT, () => {
//   info(`Server running on port ${PORT}`)
// })

const app = require('./app')
const config = require('./utils/config.js')
const logger = require('./utils/logger.js')

// import { app } from './app.js'
// import { PORT } from './utils/config.js'
// import { info } from './utils/logger.js'

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})

