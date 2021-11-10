import Caller from '@/api/call'

/**
 * Archive
 * @memberof API.Project
 * @param {Object} project Project `{ title, description }`
 * @returns TODO
 */
const archive = async (project) => {
  return Caller.call('/api/project/' + project.id + '/archive', {
    method: 'GET',
    headers: {
      Accept: 'application/json'
    }
  })
}

export default archive
