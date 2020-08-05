import isElectron from 'is-electron'

import call from './call'

const base = isElectron() ? 'http://localhost:3000' : ''

export default async ({ username, password }) => {
  const res = await fetch(base + '/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ username: username, password: password })
  })

  if (res.status === 200) {
    const user = await res.json()
    return user
  } else {
    return null
  }
}
