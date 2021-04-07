import GroupLib from '@/lib/group'
import OrganizationLib from '@/lib/organization'

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

  // Objects groups
  if (object?.groups)
    for (let group of object.groups) {
      const groupData = await GroupLib.get(group, ['organization'])
      const organizationData = await OrganizationLib.get(
        groupData.organization,
        ['owners', 'users']
      )

      if (
        organizationData?.owners?.find((o) => o === id) ||
        organizationData?.users?.find((u) => u === id)
      )
        return true
    }

  // Parent objects groups
  if (parentObject?.groups)
    for (let group of parentObject.groups) {
      const groupData = await GroupLib.get(group, ['organization'])
      const organizationData = await OrganizationLib.get(
        groupData.organization,
        ['owners', 'users']
      )

      if (
        organizationData?.owners?.find((o) => o === id) ||
        organizationData?.users?.find((u) => u === id)
      )
        return true
    }

  return false
}

export default auth
