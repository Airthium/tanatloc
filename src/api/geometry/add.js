import Caller from '@/api/call'

/**
 * Add geometry
 * @memberof module:api/geometry
 * @param {Object} project Project { id }
 * @param {Object} geometry Geometry { name, uid, buffer }
 */
const add = async (project, geometry) => {
  return Caller.call('/api/geometry', {
    method: 'POST',
    body: JSON.stringify({ project, geometry })
  })
}

export default add
