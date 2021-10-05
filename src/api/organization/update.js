import Caller from '@/api/call'

/**
 * Update
 * @memberof API.Organization
 * @param {Object} Organization Organization `{ id }`
 * @param {Array} data Data
 */
const update = async (id, data) => {
  await Caller.call('/api/organization', {
    method: 'PUT',
    body: JSON.stringify({ id, data })
  })
}

export default update
