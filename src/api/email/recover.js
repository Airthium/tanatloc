import Caller from '@/api/call'

import { PASSWORD_RECOVERY } from '@/config/email'

const recover = async (email) => {
  return Caller.call('/api/email', {
    method: 'PUT',
    body: JSON.stringify({ type: PASSWORD_RECOVERY, email })
  })
}

export default recover
