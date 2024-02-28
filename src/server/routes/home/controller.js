import { searchCases, createCase } from '~/src/server/services/dataverse'
import { config } from '~/src/config'

export const get = async (request, h) => {
  const signInUrl = `${config.get('entraOAuthUrl')}oauth2/v2.0/authorize?client_id=${config.get('entraClientId')}&response_type=id_token
&redirect_uri=http%3A%2F%2Flocalhost:3000%2Fmarine-licensing-frontend-demo%2Fauth%2Fcallback&response_mode=form_post&scope=openid&state=12345&nonce=678910`

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
