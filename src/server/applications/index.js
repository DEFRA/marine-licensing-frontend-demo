import {
  getApplication,
  getApplicationAmendment
} from '~/src/server/applications/controller'

const applications = {
  plugin: {
    name: 'applications',
    register: async (server) => {
      server.route([getApplication, getApplicationAmendment])
    }
  }
}

export { applications }
