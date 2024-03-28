import Wreck from '@hapi/wreck'
import { config } from '~/src/config'

const breadcrumbs = [
  {
    text: 'home',
    href: `${config.get('appPathPrefix')}`
  },
  {
    text: 'admin',
    href: `${config.get('appPathPrefix')}/admin`
  }
]

export const getAdminPage = {
  method: 'GET',
  path: '/admin',
  handler: async (_, h) => {
    const heading = 'Admin'
    return h.view('admin/index', {
      pageTitle: heading,
      heading,
      breadcrumbs,
      dropDatabasesUrl: `${config.get('appPathPrefix')}${postDropDatabase.path}`
    })
  }
}

export const postDropDatabase = {
  method: 'POST',
  path: '/admin/drop-database',
  handler: async (_, h) => {
    const heading = 'Dropped Database'

    await Wreck.post(`${config.get('backendApiUrl')}/admin/drop-database`)

    return h.view('admin/drop-database', {
      pageTitle: heading,
      heading,
      breadcrumbs,
      continueUrl: `${config.get('appPathPrefix')}${getAdminPage.path}`
    })
  }
}
