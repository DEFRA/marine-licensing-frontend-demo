import { searchCases, createCase } from '~/src/server/services/dataverse'

export const get = async (request, h) => {
  const signInUrl = `marine-licensing-frontend-demo/auth/callback`

  const session = request.state.session
  const email = session?.email
  const displayName = session?.displayName

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
  return h.view('routes/home/index', {
    pageTitle: 'Home',
    heading: 'Home',
    breadcrumbs: [
      {
        text: 'Home',
        href: '/'
      }
    ],
    rows,
    signInUrl,
    profile: { email, displayName }
  })
}

export const post = async (request, h) => {
  await createCase(request.payload)
  return get(request, h)
}
