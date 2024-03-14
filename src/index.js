import { config } from '~/src/config'
import { createServer } from '~/src/server'
import { createLogger } from '~/src/server/common/helpers/logging/logger'
import { EventEmitter } from 'events'
import { omit } from 'lodash'

import Wreck from '@hapi/wreck'

const logger = createLogger()

process.on('unhandledRejection', (error) => {
  logger.info('Unhandled rejection')
  logger.error(error)
  process.exit(1)
})

async function startServer() {
  const server = await createServer()
  await server.start()

  server.logger.info('Server started successfully')
  server.logger.info(
    `Access your frontend on http://localhost:${config.get('port')}${config.get(
      'appPathPrefix'
    )}`
  )
}

startServer().catch((error) => {
  logger.info('Server failed to start :(')
  logger.error(error)
})

// to show SSO requests made via @hapi/bell
Wreck.events = new EventEmitter() // this is a painful hack, but necessary
Wreck.events.on('response', (boom, { uri }) => {
  console.log(omit(uri, ['agent']))
})
