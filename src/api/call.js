import isElectron from 'is-electron'

export default async (route, parameters) => {
  const url = (isElectron() ? 'http://localhost:3000/' : '') + route
  const res = await fetch(url, {
    method: parameters && (parameters.method || 'GET'),
    headers: {
      'Content-Type': 'application/json',
      ...(parameters && parameters.headers)
    },
    ...parameters
  })
  return res
}
