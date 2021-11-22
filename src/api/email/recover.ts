import { call } from '@/api/call'

import { PASSWORD_RECOVERY } from '@/config/email'

/**
 * Recover
 * @memberof API.Email
 * @param email email
 */
export const recover = async (email: string): Promise<void> => {
  await call('/api/email', {
    method: 'PUT',
    body: JSON.stringify({ type: PASSWORD_RECOVERY, email })
  })
}
