import convict from 'convict'
import path from 'path'

const oneWeek = 7 * 24 * 60 * 60 * 1000

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneWeek,
    env: 'STATIC_CACHE_TIMEOUT'
  },
  serviceName: {
    doc: 'Applications Service Name',
    format: String,
    default: 'marine-licensing-frontend-demo'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.normalize(path.join(__dirname, '..', '..'))
  },
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: 'public',
    env: 'ASSET_PATH'
  },
  appPathPrefix: {
    doc: 'Application url path prefix',
    format: String,
    default: '/marine-licensing-frontend-demo',
    env: 'APP_PATH_PREFIX'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'production'
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production'
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  logLevel: {
    doc: 'Logging level',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
    default: 'info',
    env: 'LOG_LEVEL'
  },
  httpProxy: {
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  },
  httpsProxy: {
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  },
  entraOAuthUrl: {
    doc: 'base url for using oauth with Entra (formerly Azure Active Directory)',
    format: String,
    nullable: true,
    default: null,
    env: 'ENTRA_OAUTH_URL'
  },
  entraClientId: {
    doc: 'Client id to authenticate to Entra (formerly Azure Active Directory) to generate oauth tokens',
    format: String,
    nullable: true,
    default: null,
    env: 'ENTRA_CLIENT_ID'
  },
  entraClientSecret: {
    doc: 'Client secret to authenticate to Entra (formerly Azure Active Directory) to genearte oauth tokens',
    format: String,
    nullable: true,
    default: null,
    env: 'ENTRA_CLIENT_SECRET'
  },
  dataverseApiDomain: {
    doc: 'Domain for all dataverse API requests (includes environment as the sub-domain)',
    format: String,
    nullable: true,
    default: null,
    env: 'DATAVERSE_API_DOMAIN'
  },
  dynamicsAppId: {
    doc: 'Application id for dynamics instance',
    format: String,
    nullable: true,
    default: null,
    env: 'DYNAMICS_APP_ID'
  },
  dynamicsDomain: {
    doc: 'domain for dynamics instance',
    format: String,
    nullable: true,
    default: null,
    env: 'DYNAMICS_DOMAIN'
  }
})

config.validate({ allowed: 'strict' })

export { config }
