import { get, post } from './controller'

const home = {
  plugin: {
    name: 'home',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/',
          handler: get
        },
        {
          method: 'POST',
          path: '/',
          handler: post
        }
      ])
    }
  }
}

export { home }
