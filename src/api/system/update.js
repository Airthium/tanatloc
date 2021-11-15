import { call } from '@/api/call'

/**
 * Update items
 * @memberof API.System
 * @param {string} data Data
 */
const update = async (data) => {
  await call('/api/system', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
