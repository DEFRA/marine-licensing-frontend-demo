import Wreck from '@hapi/wreck'
import { config } from '~/src/config'

const breadcrumbs = [
  {
    text: 'home',
    href: `${config.get('appPathPrefix')}`
  },
  {
    text: 'apply',
    href: `${config.get('appPathPrefix')}/apply`
  }
]

const getRoute = {
  method: 'GET',
  path: '/apply',
  handler: (_, h) => {
    return h.view('apply/index', {
      pageTitle: 'Apply',
      heading: 'Apply for a Marine License',
      breadcrumbs
    })
  }
}

const postRoute = {
  method: 'POST',
  path: '/apply',
  handler: async (request, h) => {
    const { params } = request

    await Wreck.post(`${config.get('backendApiUrl')}`, { ...params })

    return h.view('apply/submitted', {
      pageTitle: 'Application submitted',
      heading: 'Marine license application submitted',
      breadcrumbs,
      continueUrl: config.get('appPathPrefix')
    })
  }
}

export { getRoute, postRoute }
