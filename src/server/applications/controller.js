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

    const { payload: applicationJson } = await Wreck.get(
      `${config.get('backendApiUrl')}/applications/${prefix}/${year}/${sequenceNumber}`
    )
    const application = JSON.parse(applicationJson).value

    return h.view('applications/index', {
      pageTitle: `Application ${prefix}/${year}/${sequenceNumber}`,
      heading: `Application ${prefix}/${year}/${sequenceNumber}`,
      breadcrumbs,
      application,
      formDisabled: true
    })
  }
}

export const getApplicationAmendment = {
  method: 'GET',
  path: '/applications/{prefix}/{year}/{sequenceNumber}/amend',
  handler: async (request, h) => {
    const {
      params: { prefix, year, sequenceNumber }
    } = request

    const { payload: applicationJson } = await Wreck.get(
      `${config.get('backendApiUrl')}/applications/${prefix}/${year}/${sequenceNumber}`
    )
    const { value: application } = JSON.parse(applicationJson)

    const { payload: amendmentJson } = await Wreck.get(
      `${config.get('backendApiUrl')}/applications/${prefix}/${year}/${sequenceNumber}/amendment-request`
    )
    const { value: amendment } = JSON.parse(amendmentJson)

    return h.view('applications/amend', {
      pageTitle: `Application ${prefix}/${year}/${sequenceNumber}`,
      heading: `Application ${prefix}/${year}/${sequenceNumber}`,
      breadcrumbs,
      application,
      amendment
    })
  }
}
