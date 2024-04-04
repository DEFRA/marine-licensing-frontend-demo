import {
  getApplication,
  getReview,
  postReview
} from '~/src/server/applications/controller'

const applications = {
  plugin: {
    name: 'applications',
    register: async (server) => {
      server.route([getApplication, getReview, postReview])
    }
  }
}

export { applications }
