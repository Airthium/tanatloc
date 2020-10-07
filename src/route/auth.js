/**
 * Check authorization
 * @param {Object} object Object (Project || Workspace)
 * @param {string} id User's id
 */
const auth = (object, id) => {
  if (
    (object.owners && object.owners.includes(id)) ||
    (object.users && object.users.includes(id))
  ) {
    return true
  }
  return false
}

export default auth
