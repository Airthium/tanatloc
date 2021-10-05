import Caller from '@/api/call'

/**
 * Add
 * @memberof API.Geometry
 * @param {Object} project Project `{ id }`
 * @param {Object} geometry Geometry `{ name, uid, buffer }`
 * @returns {Object} Geometry `{ id, name, originalfilename, extension, uploadfilename, json, glb, summary }`
 */
const add = async (project, geometry) => {
  return Caller.call('/api/geometry', {
    method: 'POST',
    body: JSON.stringify({ project, geometry })
  })
}

export default add
