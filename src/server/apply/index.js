import { postRoute, getRoute } from '~/src/server/apply/controller'

const apply = {
  plugin: {
    name: 'apply',
    register: async (server) => {
      server.route([getRoute, postRoute])
    }
  }
}

export { apply }
