import inert from '@hapi/inert'

import { health } from '~/src/server/health'
import { home } from '~/src/server/home'
import { apply } from '~/src/server/apply'
import { applications } from '~/src/server/applications'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files'

const router = {
  plugin: {
    name: 'router',
    register: async (server) => {
      await server.register([inert])
      await server.register([
        health,
        home,
        apply,
        applications,
        serveStaticFiles
      ])
    }
  }
}

export { router }
