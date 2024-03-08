import { searchCases } from '~/src/server/services/dataverse'
import { config } from '~/src/config'

export const get = async (request, h) => {
  const signInUrl = `/marine-licensing-frontend-demo/auth/callback`
  const session = request.state.session

  const cases = await searchCases()
  const rows = cases.map((c) => [
    {
      text: c.number
    },
    {
      text: c.title
    },
    {
      html: `<a href="${c.link}">view case</a>`
    }
  ])
  return h.view('routes/admin/index', {
    pageTitle: 'Admin',
    heading: 'Admin',
    breadcrumbs: [
      {
        text: 'home',
        href: `${config.get('appPathPrefix')}`
      },
      {
        text: 'admin',
        href: `${config.get('appPathPrefix')}/admin`
      }
    ],
    rows,
    signInUrl,
    profile: session
  })
}
