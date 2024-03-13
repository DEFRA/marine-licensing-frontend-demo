import { config } from '~/src/config'

import SimpleOAuth2 from 'simple-oauth2'
import Wreck from '@hapi/wreck'

const id = config.get('entraClientId')
const secret = config.get('entraClientSecret')
const tokenHost = config.get('entraOAuthUrl')

export const dataverseBaseUrl = 'https://' + config.get('dataverseApiDomain')
const scope = dataverseBaseUrl + '/.default'

const dataverseApiUrl = `${dataverseBaseUrl}/api/data/v9.2/`
const dataverseIncidentsUrl = `${dataverseApiUrl}/incidents`
const dataverseContactsUrl = `${dataverseApiUrl}/contacts`

export const getServerToServerAccessToken = async () => {
  const oauthClient = new SimpleOAuth2.ClientCredentials({
    client: { id, secret },
    auth: {
      tokenHost: dataverseBaseUrl,
      tokenPath: `${tokenHost}/oauth2/v2.0/token`
    },
    options: {
      authorizationMethod: 'body',
      bodyFormat: 'form'
    }
  })

  const token = await oauthClient.getToken({ scope })
  return token.token.access_token
}

const oAuthHeaders = async (token) => {
  return {
    Authorization: `Bearer ${token}`,
    'OData-MaxVersion': '4.0',
    'OData-Version': '4.0'
  }
}

const getHeaders = async (token) => ({
  ...(await oAuthHeaders(token)),
  Accept: 'application/json'
})

const postHeaders = async (token) => ({
  ...(await oAuthHeaders(token)),
  Accept: 'application/json',
  Consistency: 'Strong',
  'Content-Type': 'application/json',
  Prefer: 'odata.include-annotations=' * ''
})

const getContact = async (token, contactName) => {
  const url = `${dataverseContactsUrl}?$filter=contains(fullname, '${contactName}')`
  const { payload } = await Wreck.get(url, {
    headers: await getHeaders(token)
  })

  return { contactId: JSON.parse(payload).value[0].contactid }
}

export const createCase = async (token, { title, name }) => {
  const { contactId } = await getContact(token, name)
  const { payload } = await Wreck.post(dataverseIncidentsUrl, {
    headers: await postHeaders(token),
    payload: JSON.stringify({
      title,
      statuscode: -1,
      prioritycode: 2,
      caseorigincode: null,
      ticketnumber: null,
      'customerid_contact@odata.bind': `/contacts(${contactId})`,
      createdon: null
    })
  })
  return payload
}

const caseDetails = (caseResponse) =>
  caseResponse.value.map((e) => ({
    number: e.ticketnumber,
    title: e.title,
    link: `https://${config.get('dynamicsDomain')}/main.aspx?appid=${config.get('dynamicsAppId')}&pagetype=entityrecord&etn=incident&id=${e.incidentid}`
  }))

export const searchCases = async (token) => {
  const { payload } = await Wreck.get(`${dataverseIncidentsUrl}`, {
    headers: await getHeaders(token)
  })
  return caseDetails(JSON.parse(payload))
}
