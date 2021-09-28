import error from './error'

import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'
import GroupLib from '@/lib/group'
import GeometryLib from '@/lib/geometry'
import SimulationLib from '@/lib/simulation'
import OrganizationLib from '@/lib/organization'

/**
 * Check authorization
 * @memberof module:route
 * @param {Object} user User { id }
 * @param {Object} object Object (Project || Workspace || Organization)
 * @param {Object} parentObject Parent object (Workspace)
 */
const auth = async (user, object, parentObject) => {
  // Objects
  if (object?.owners?.includes(user.id) || object?.users?.includes(user.id))
    return true

  // Parent object
  if (
    parentObject?.owners?.includes(user.id) ||
    parentObject?.users?.includes(user.id)
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

      if (await auth(user, organizationData)) return true
    }

  // Parent objects groups
  if (parentObject?.groups)
    for (let group of parentObject.groups) {
      const groupData = await GroupLib.get(group, ['organization'])
      console.log(groupData)
      const organizationData = await OrganizationLib.get(
        groupData.organization,
        ['owners', 'users']
      )

      if (await auth(user, organizationData)) return true
    }

  return false
}

/**
 * Check workspace auth
 * @memberof module:route
 * @param {Object} user User { id }
 * @param {Object} workspace Workspace {id }
 * @param {?number} status Override workspace error status
 */
const checkWorkspaceAuth = async (user, workspace, status) => {
  const workspaceAuth = await WorkspaceLib.get(
    workspace.id,
    ['owners', 'users', 'groups'],
    false
  )
  if (!workspaceAuth) throw error(status || 400, 'Invalid workspace identifier')

  if (!(await auth(user, workspaceAuth))) throw error(403, 'Access denied')
}

/**
 * Check project auth
 * @memberof module:route
 * @param {Object} user User { id }
 * @param {Object} project Project { id }
 * @param {?number} status Override project error status
 */
const checkProjectAuth = async (user, project, status) => {
  const projectAuth = await ProjectLib.get(
    project.id,
    ['owners', 'users', 'groups', 'workspace'],
    false
  )
  if (!projectAuth) throw error(status || 400, 'Invalid project identifier')

  const workspaceAuth = await WorkspaceLib.get(
    projectAuth.workspace,
    ['owners', 'users', 'groups'],
    false
  )
  if (!workspaceAuth) throw error(500, 'Invalid workspace identifier')

  if (!(await auth(user, projectAuth, workspaceAuth)))
    throw error(403, 'Access denied')
}

/**
 * Check geometry auth
 * @memberof module:route
 * @param {Object} user User { id }
 * @param {Object} geometry Geometry { id }
 * @param {?number} status Override simulation error status
 */
const checkGeometryAuth = async (user, geometry, status) => {
  const geometryAuth = await GeometryLib.get(geometry.id, ['project'])
  if (!geometryAuth) throw error(status || 400, 'Invalid geometry identifier')

  const projectAuth = await ProjectLib.get(
    geometryAuth.project,
    ['owners', 'users', 'groups', 'workspace'],
    false
  )
  if (!projectAuth) throw error(500, 'Invalid project identifier')

  const workspaceAuth = await WorkspaceLib.get(
    projectAuth.workspace,
    ['owners', 'users', 'groups'],
    false
  )
  if (!workspaceAuth) throw error(500, 'Invalid workspace identifier')

  if (!(await auth(user, projectAuth, workspaceAuth)))
    throw error(403, 'Access denied')
}

/**
 * Check simulation auth
 * @memberof module:route
 * @param {Object} user User { id }
 * @param {Object} simulation Simulation { id }
 * @param {?number} status Override simulation error status
 */
const checkSimulationAuth = async (user, simulation, status) => {
  const simulationAuth = await SimulationLib.get(simulation.id, ['project'])
  if (!simulationAuth)
    throw error(status || 400, 'Invalid simulation identifier')

  const projectAuth = await ProjectLib.get(
    simulationAuth.project,
    ['owners', 'users', 'groups', 'workspace'],
    false
  )
  if (!projectAuth) throw error(500, 'Invalid project identifier')

  const workspaceAuth = await WorkspaceLib.get(
    projectAuth.workspace,
    ['owners', 'users', 'groups'],
    false
  )
  if (!workspaceAuth) throw error(500, 'Invalid workspace identifier')

  if (!(await auth(user, projectAuth, workspaceAuth)))
    throw error(403, 'Access denied')
}

/**
 * Check organization auth
 * @memberof module:route
 * @param {Object} user User { id }
 * @param {Object} organization Organization { id }
 * @param {?number} status Override project error status
 */
const checkOrganizationAuth = async (user, organization, status) => {
  const organizationAuth = await OrganizationLib.get(organization.id, [
    'owners',
    'users'
  ])
  if (!organizationAuth)
    throw error(status || 400, 'Invalid organization identifier')

  if (!(await auth(user, organizationAuth))) throw error(403, 'Access denied')
}

export default auth
export {
  checkWorkspaceAuth,
  checkProjectAuth,
  checkGeometryAuth,
  checkSimulationAuth,
  checkOrganizationAuth
}
