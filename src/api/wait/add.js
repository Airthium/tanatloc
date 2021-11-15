import { call } from '@/api/call'

const add = async (user) => {
  return call('/api/wait', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })
}

export default add
