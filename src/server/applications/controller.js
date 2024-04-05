import Wreck from '@hapi/wreck'
import { config } from '~/src/config'

const breadcrumbs = [
  {
    text: 'home',
    href: `${config.get('appPathPrefix')}`
  }
]

const fetchFullApplication = async (applicationId) => {
  const { payload: applicationJson } = await Wreck.get(
    `${config.get('backendApiUrl')}/applications/${applicationId}`
  )
  const application = JSON.parse(applicationJson).value

  const { payload: amendmentJson } = await Wreck.get(
    `${config.get('backendApiUrl')}/applications/${applicationId}/amendment-request`
  )
  const { value: amendment } = JSON.parse(amendmentJson)

  return { application, amendment }
}

export const getApplicationCaseworker = {
  method: 'GET',
  path: '/applications/{prefix}/{year}/{sequenceNumber}',
  handler: async (request, h) => {
    const {
      params: { prefix, year, sequenceNumber }
    } = request

    const applicationId = `${prefix}/${year}/${sequenceNumber}`
    const { application, amendment } = await fetchFullApplication(applicationId)

    return h.view('applications/caseworker-index', {
      pageTitle: `Application ${prefix}/${year}/${sequenceNumber}`,
      heading: `Application ${prefix}/${year}/${sequenceNumber}`,
      breadcrumbs,
      application,
      amendment,
      reviewUrl: `${config.get('appPathPrefix')}/applications/${applicationId}/review`,
      formDisabled: true
    })
  }
}

export const getApplicationApplicant = {
  method: 'GET',
  path: '/applications/applicant/{prefix}/{year}/{sequenceNumber}',
  handler: async (request, h) => {
    const {
      params: { prefix, year, sequenceNumber }
    } = request

    const applicationId = `${prefix}/${year}/${sequenceNumber}`
    const { application, amendment } = await fetchFullApplication(applicationId)

    return h.view('applications/index', {
      pageTitle: `Application ${prefix}/${year}/${sequenceNumber}`,
      heading: `Application ${prefix}/${year}/${sequenceNumber}`,
      breadcrumbs,
      application,
      amendment,
      reviewUrl: `${config.get('appPathPrefix')}/applications/${applicationId}/review`,
      formDisabled: application.applicationStatus === 'submitted'
    })
  }
}

export const getReview = {
  method: 'GET',
  path: '/applications/{prefix}/{year}/{sequenceNumber}/review',
  handler: async (request, h) => {
    const {
      params: { prefix, year, sequenceNumber }
    } = request

    const applicationId = `${prefix}/${year}/${sequenceNumber}`
    const { application, amendment } = await fetchFullApplication(applicationId)

    return h.view('applications/review', {
      pageTitle: `Reviewing Application ${prefix}/${year}/${sequenceNumber}`,
      heading: `Reviewing Application ${prefix}/${year}/${sequenceNumber}`,
      breadcrumbs,
      application,
      amendment,
      reviewMode: true,
      formDisabled: true
    })
  }
}

export const postReview = {
  method: 'POST',
  path: '/applications/{prefix}/{year}/{sequenceNumber}/review',
  handler: async (request, h) => {
    const {
      payload: {
        title,
        background,
        site,
        firstName,
        lastName,
        address,
        email,
        titleAmend,
        backgroundAmend,
        siteAmend,
        firstNameAmend,
        lastNameAmend,
        addressAmend,
        emailAmend
      },
      params: { prefix, year, sequenceNumber }
    } = request

    const amendment = (originalValue, comment) => {
      if (comment !== '') return { originalValue, comment }
    }

    const applicationId = `${prefix}/${year}/${sequenceNumber}`

    const amendmentRequest = {
      applicationId,
      title: amendment(title, titleAmend),
      background: amendment(background, backgroundAmend),
      applicant: {
        firstName: amendment(firstName, firstNameAmend),
        lastName: amendment(lastName, lastNameAmend),
        address: amendment(address, addressAmend),
        email: amendment(email, emailAmend)
      },
      site: {
        coordinates: amendment(site, siteAmend)
      }
    }

    await Wreck.put(
      `${config.get('backendApiUrl')}/applications/${applicationId}/amendment-request`,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        payload: amendmentRequest
      }
    )

    return h.view('applications/review-submitted', {
      pageTitle: 'Application review submitted',
      heading: `Marine license application review submitted for ${applicationId}`,
      breadcrumbs,
      continueUrl: config.get('appPathPrefix')
    })
  }
}
