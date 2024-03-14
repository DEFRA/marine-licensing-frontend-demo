import jwt from '@hapi/jwt'
import bell from '@hapi/bell'
import { config } from '~/src/config'
import { dataverseBaseUrl } from '~/src/server/services/dataverse'

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

      const claims = {
        id_token: {
          groups: { essential: true },
          roles: { essential: true }
        }
      }

      const scope = ['openid', `${dataverseBaseUrl}/user_impersonation`]

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
          scope,
          profile: async function (credentials, params) {
            const payload = jwt.token.decode(credentials.token).decoded.payload
            const idTokenPayload = jwt.token.decode(params.id_token).decoded
              .payload

            credentials.profile = {
              id: payload.oid,
              displayName: payload.name,
              email: payload.upn ?? payload.preferred_username,
              loginHint: payload.login_hint,
              roles: idTokenPayload.roles,
              accessToken: credentials.token
            }
          }
        },
        password: 'foobarquuxasldkjadlkasjdsaldkjasdlkasjdsalkdjsaldksjadlakj',
        clientId: config.get('entraClientId'),
        clientSecret: config.get('entraClientSecret'),
        providerParams: {
          redirect_uri: authCallbackUrl,
          claims: encodeURI(JSON.stringify(claims))
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
