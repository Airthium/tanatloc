import isElectron from 'is-electron'

export default (url) => {
  const base = isElectron() ? 'http://localhost:3000/' : ''
  return fetch(base + url).then((r) => r.json())
}
