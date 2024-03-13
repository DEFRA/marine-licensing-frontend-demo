import {
  getServerToServerAccessToken,
  createCase
} from '~/src/server/services/dataverse'

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
  const token = await getServerToServerAccessToken()
  await createCase(token, request.payload)
  return h.view('routes/home/form-submitted', {
    pageTitle: 'Home',
    heading: 'Home'
  })
}
