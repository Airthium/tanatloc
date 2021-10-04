import Caller from '@/api/call'

const add = async (user) => {
  return Caller.call('/api/wait', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(user)
  })
}

export default add
