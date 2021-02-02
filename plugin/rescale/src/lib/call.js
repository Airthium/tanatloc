import urlJoin from 'url-join'
import fetch from 'node-fetch'

const call = async (configuration) => {
  const platform = configuration.platform
  const api = '/api/v2/'
  const token = configuration.token
  const route = configuration.route

  const absoluteRoute = configuration.absoluteRoute

  const url = absoluteRoute || urlJoin('https://', platform, api, route)

  const response = await new Promise((resolve, reject) => {
    fetch(url, {
      method: configuration.method || 'GET',
      headers: {
        Authorization: 'Token ' + token
      },
      body: configuration.body
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })

  const contentType = response.headers.get('Content-Type')
  console.log(contentType)

  if (contentType === 'application/json') {
    const json = await response.json()

    if (json.next) {
      const nextJson = await call({
        ...configuration,
        absoluteRoute: json.next
      })

      json.results = [...json.results, ...nextJson.results]
    }

    return json
  }

  return response
}

export default call
