import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

export const fetcher = (url) => fetch(base + url).then((r) => r.json())

export const call = async (route, param) => {
  const response = await fetch(base + route, {
    method: param.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(param && param.headers)
    },
    ...param
  })

  const res = await response.json()
  return res
}
