import inert from '@hapi/inert'

import { health } from '~/src/server/routes/health'
import { home } from '~/src/server/routes/home'
import { auth } from '~/src/server/routes/auth'
import { admin } from '~/src/server/routes/admin'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([health, home, auth, admin, serveStaticFiles])
    }
  }
}

export { router }
