import { createCase } from '~/src/server/services/dataverse'

export const get = async (request, h) => {
  return h.view('routes/home/index', {
    pageTitle: 'Home',
    heading: 'Home',
    breadcrumbs: [
      {
        text: 'Home',
        href: '/'
      }
    ]
  })
}

export const post = async (request, h) => {
  await createCase(request.payload)
  return h.view('routes/home/form-submitted', {
    pageTitle: 'Home',
    heading: 'Home'
  })
}
