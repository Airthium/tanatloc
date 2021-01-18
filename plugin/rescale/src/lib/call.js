import urlJoin from 'url-join'
import fetch from 'node-fetch'

const call = async (configuration) => {
  const platform = configuration.platform
  const api = '/api/v2/'
  const token = configuration.token
  const route = configuration.route

  const url = urlJoin('https://', platform, api, route)

  const response = await new Promise((resolve, reject) => {
    fetch(url, {
      headers: {
        Authorization: 'Token ' + token
      }
    })
      .then((res) => resolve(res))
      .catch((err) => reject(err))
  })

  const contentType = response.headers.get('Content-Type')
  console.log(contentType)

  if (contentType === 'application/json') {
    const json = await response.json()

    if (json.next) {
      const nextResponse = await call({
        ...configuration,
        route: json.next
      })

      const nextJson = await nextResponse.json()

      json.results = [...json.results, ...nextJson.results]
    }

    return json
  }

  return response
}

export default call
