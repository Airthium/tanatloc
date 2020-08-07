import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

export const fetcher = (url) => fetch(base + url).then((r) => r.json())

export const call = async (route, param) => {
  const response = await fetch(base + route, {
    method: (param && param.method) || 'GET',
    ...param,
    headers: {
      ...(param && param.headers),
      'Content-Type': 'application/json'
    }
  })

  if (param && param.headers && param.headers.Accept === 'application/json') {
    const res = await response.json()
    return res
  }
}
