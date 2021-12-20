import { error } from './error'

import ProjectLib from '@/lib/project'
import WorkspaceLib from '@/lib/workspace'
import GroupLib from '@/lib/group'
import OrganizationLib from '@/lib/organization'
import GeometryLib from '@/lib/geometry'
import SimulationLib from '@/lib/simulation'

import { IProject, IWorkspace, IOrganization } from '@/database/index.d'

/**
 * Check authorization from group
 * @param user User
 * @param object Object
 * @returns True / false
 */
const authGroup = async (
  user: { id: string },
  object: IProject | IWorkspace | IOrganization
) => {
  for (let group of object.groups) {
    const groupData = await GroupLib.get(group, ['organization'])
    const organizationData = await OrganizationLib.get(groupData.organization, [
      'owners',
      'users'
    ])

    if (await auth(user, organizationData)) return true
  }

  return false
}

/**
 * Check authorization
 * @memberof Route
 * @param user User
 * @param object Object (Project || Workspace || Organization)
 * @param parentObject Parent object (Workspace)
 */
const auth = async (
  user: { id: string },
  object: IProject | IWorkspace | IOrganization,
  parentObject?: IWorkspace
) => {
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
  if (object?.groups) if (await authGroup(user, object)) return true

  // Parent objects groups
  if (parentObject?.groups) if (await authGroup(user, parentObject)) return true

  return false
}

/**
 * Check workspace auth
 * @memberof Route
 * @param user User
 * @param workspace Workspace
 * @param status Override workspace error status
 */
const checkWorkspaceAuth = async (
  user: { id: string },
  workspace: { id: string },
  status?: number
) => {
  const workspaceAuth = await WorkspaceLib.get(workspace.id, [
    'owners',
    'users',
    'groups'
  ])
  if (!workspaceAuth) throw error(status || 400, 'Invalid workspace identifier')

  if (!(await auth(user, workspaceAuth))) throw error(403, 'Access denied')
}

/**
 * Check project auth
 * @memberof Route
 * @param user User
 * @param project Project
 * @param status Override project error status
 */
const checkProjectAuth = async (
  user: { id: string },
  project: { id: string },
  status?: number
): Promise<void> => {
  const projectAuth = await ProjectLib.get(project.id, [
    'owners',
    'users',
    'groups',
    'workspace'
  ])
  if (!projectAuth) throw error(status || 400, 'Invalid project identifier')

  const workspaceAuth = await WorkspaceLib.get(projectAuth.workspace, [
    'owners',
    'users',
    'groups'
  ])
  if (!workspaceAuth) throw error(500, 'Invalid workspace identifier')

  if (!(await auth(user, projectAuth, workspaceAuth)))
    throw error(403, 'Access denied')
}

/**
 * Check geometry auth
 * @memberof Route
 * @param user User
 * @param geometry Geometry
 * @param status Override simulation error status
 */
const checkGeometryAuth = async (
  user: { id: string },
  geometry: { id: string },
  status?: number
): Promise<void> => {
  const geometryAuth = await GeometryLib.get(geometry.id, ['project'])
  if (!geometryAuth) throw error(status || 400, 'Invalid geometry identifier')

  const projectAuth = await ProjectLib.get(geometryAuth.project, [
    'owners',
    'users',
    'groups',
    'workspace'
  ])
  if (!projectAuth) throw error(500, 'Invalid project identifier')

  const workspaceAuth = await WorkspaceLib.get(projectAuth.workspace, [
    'owners',
    'users',
    'groups'
  ])
  if (!workspaceAuth) throw error(500, 'Invalid workspace identifier')

  if (!(await auth(user, projectAuth, workspaceAuth)))
    throw error(403, 'Access denied')
}

/**
 * Check simulation auth
 * @memberof Route
 * @param user User
 * @param simulation Simulation
 * @param status Override simulation error status
 */
const checkSimulationAuth = async (
  user: { id: string },
  simulation: { id: string },
  status?: number
): Promise<void> => {
  const simulationAuth = await SimulationLib.get(simulation.id, ['project'])
  if (!simulationAuth)
    throw error(status || 400, 'Invalid simulation identifier')

  const projectAuth = await ProjectLib.get(simulationAuth.project, [
    'owners',
    'users',
    'groups',
    'workspace'
  ])
  if (!projectAuth) throw error(500, 'Invalid project identifier')

  const workspaceAuth = await WorkspaceLib.get(projectAuth.workspace, [
    'owners',
    'users',
    'groups'
  ])
  if (!workspaceAuth) throw error(500, 'Invalid workspace identifier')

  if (!(await auth(user, projectAuth, workspaceAuth)))
    throw error(403, 'Access denied')
}

/**
 * Check organization auth
 * @memberof Route
 * @param user User
 * @param organization Organization
 * @param status Override project error status
 */
const checkOrganizationAuth = async (
  user: { id: string },
  organization: { id: string },
  status?: number
): Promise<void> => {
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
