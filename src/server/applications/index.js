import {
  getApplicationCaseworker,
  getApplicationApplicant,
  getReview,
  postReview
} from '~/src/server/applications/controller'

const applications = {
  plugin: {
    name: 'applications',
    register: async (server) => {
      server.route([
        getApplicationApplicant,
        getApplicationCaseworker,
        getReview,
        postReview
      ])
    }
  }
}

export { applications }
