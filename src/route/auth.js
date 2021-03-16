// import UserLib from '@/lib/user'

/**
 * Check authorization
 * @memberof module:route
 * @param {string} id User's id
 * @param {Object} object Object (Project || Workspace)
 * @param {Object} parentObject Parent object (Workspace)
 */
const auth = async (id, object, parentObject) => {
  // Objects
  if (
    object?.owners?.find((o) => o.id === id) ||
    object?.users?.find((u) => u.id === id)
  )
    return true

  // Parent object
  if (
    parentObject?.owners?.find((o) => o.id === id) ||
    parentObject?.users?.find((u) => u.id === id)
  )
    return true

  // // Group objects
  // const user = await UserLib.get(id, ['groups'])
  // if (user?.groups.find((g) => object?.groups?.find((gg) => gg.id === g)))
  //   return true
  // if (user?.groups.find((g) => parentObject?.groups?.find((gg) => gg.id === g)))
  //   return true

  return false
}

export default auth
