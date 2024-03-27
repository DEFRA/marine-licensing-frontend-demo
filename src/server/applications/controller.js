import Wreck from '@hapi/wreck'
import { config } from '~/src/config'

const breadcrumbs = [
  {
    text: 'home',
    href: `${config.get('appPathPrefix')}`
  }
]

export const getApplication = {
  method: 'GET',
  path: '/applications/{prefix}/{year}/{sequenceNumber}',
  handler: async (request, h) => {
    const {
      params: { prefix, year, sequenceNumber }
    } = request

    const { payload } = await Wreck.get(
      `${config.get('backendApiUrl')}/applications/${prefix}/${year}/${sequenceNumber}`
    )

    const application = JSON.parse(payload).value

    return h.view('applications/index', {
      pageTitle: `Application ${prefix}/${year}/${sequenceNumber}`,
      breadcrumbs,
      ...application
    })
  }
}
