/**
 * Check authorization
 * @param {Object} object Object (Project || Workspace)
 * @param {string} id User's id
 */
const auth = (object, id) => {
  if (
    (object && object.owners && object.owners.find((o) => o.id === id)) ||
    (object && object.users && object.users.find((u) => u.id === id))
  ) {
    return true
  }
  return false
}

export default auth
