import isElectron from 'is-electron'

const base = isElectron() ? 'http://localhost:3000' : ''

export default (url) => fetch(base + url).then((r) => r.json())
