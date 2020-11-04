import { call } from '../call'

/**
 * Update project
 * @memberof module:src/api/project
 * @param {Object} project Project { id }
 * @param {Array} data Data [{ key, value, ... }, ...]
 */
const update = async (project, data) => {
  return call('/api/project/' + project.id, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
}

export default update
