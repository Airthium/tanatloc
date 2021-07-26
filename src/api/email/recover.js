import Caller from '@/api/call'

const recover = async (email) => {
  return Caller.call('/api/email', {
    method: 'POST',
    body: JSON.stringify({ type: 'recover', email })
  })
}

export default recover
