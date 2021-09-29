import Caller from '@/api/call'

import { PASSWORD_RECOVERY } from '@/config/email'

/**
 * Recover
 * @memberof API.Email
 * @param {string} email email
 */
const recover = async (email) => {
  await Caller.call('/api/email', {
    method: 'PUT',
    body: JSON.stringify({ type: PASSWORD_RECOVERY, email })
  })
}

export default recover
