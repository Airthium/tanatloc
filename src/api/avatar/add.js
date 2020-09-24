import { call } from '../call'

/**
 * Add avatar
 * @memberof module:src/api/avatar
 * @param {File} file File
 */
const add = async (file) => {
  const res = await call('/api/avatar', {
    method: 'POST',
    headers: {
      Accept: 'application/json'
    },
    body: JSON.stringify(file)
  })

  return res
}

export default add
