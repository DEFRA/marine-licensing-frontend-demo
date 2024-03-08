import Boom from '@hapi/boom'
import { config } from '~/src/config'

const authCallbackController = {
  options: {
    auth: 'azure-oidc',
    response: {
      failAction: () => Boom.boomify(Boom.unauthorized())
    }
  },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const { profile } = request.auth.credentials
      h.state('session', profile, { path: '/' })
    }

    return h.redirect(config.get('appPathPrefix') + '/admin')
  }
}

export { authCallbackController }
