import isElectron from 'is-electron'
import call from './call'

const base = isElectron() ? 'http://localhost:3000' : ''

export default async () => {
  await fetch(base + '/api/logout')
}
