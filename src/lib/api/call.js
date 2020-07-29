import isElectron from 'is-electron'

export default async (route, parameters) => {
  const url = (isElectron() ? 'http://localhost:3000/' : '') + route
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...parameters.headers
    },
    ...parameters
  })
  const res = await response.json()
  return res
}
