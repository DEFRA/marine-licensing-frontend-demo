import { get } from './controller'

export const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/admin',
          handler: get
        }
      ])
    }
  }
}
