import jwt from '@hapi/jwt'
import bell from '@hapi/bell'
import { config } from '~/src/config'

// shamelessly stolen from https://github.com/DEFRA/forms-designer
const azureOidc = {
  plugin: {
    name: 'azure-oidc',
    register: async (server) => {
      await server.register(bell)

      const oidc = await fetch(
        config.get('entraOAuthUrl') + 'v2.0/.well-known/openid-configuration'
      ).then((res) => res.json())

      const authCallbackUrl = `http://localhost:${config.get('port')}${config.get('appPathPrefix')}/auth/callback`

      // making the OIDC config available to server
      server.app.oidc = oidc

      server.auth.strategy('azure-oidc', 'bell', {
        location: (request) => {
          return authCallbackUrl
        },
        provider: {
          name: 'azure-oidc',
          protocol: 'oauth2',
          useParamsAuth: true,
          auth: oidc.authorization_endpoint,
          token: oidc.token_endpoint,
          scope: ['openid'],
          profile: async function (credentials) {
            const payload = jwt.token.decode(credentials.token).decoded.payload

            credentials.profile = {
              id: payload.oid,
              displayName: payload.name,
              email: payload.upn ?? payload.preferred_username,
              loginHint: payload.login_hint
            }
          }
        },
        password: 'foobarquuxasldkjadlkasjdsaldkjasdlkasjdsalkdjsaldksjadlakj',
        clientId: config.get('entraClientId'),
        clientSecret: config.get('entraClientSecret'),
        providerParams: {
          redirect_uri: authCallbackUrl
        },
        cookie: 'bell-azure-oidc',
        isSecure: false,
        config: {
          tenant: config.azureTenantId
        }
      })
    }
  }
}

export { azureOidc }
