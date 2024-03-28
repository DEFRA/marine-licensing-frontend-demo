import { getAdminPage, postDropDatabase } from '~/src/server/admin/controller'

const admin = {
  plugin: {
    name: 'admin',
    register: async (server) => {
      server.route([getAdminPage, postDropDatabase])
    }
  }
}

export { admin }
