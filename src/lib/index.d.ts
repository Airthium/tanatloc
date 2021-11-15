// import { INewGeometry, IGroup, IProject, IUser, IWorkspace } from '@/database'

export interface INewGeometry extends INewGeometry {
  json: string
  glb: string
  summary: {
    type: string
    uuid: string
    solids?: Array<{
      uuid: string
      color: { r: number; g: number; b: number }
    }>
    faces?: Array<{
      uuid: string
      color: { r: number; g: number; b: number }
    }>
    edges?: Array<{
      uuid: string
      color: { r: number; g: number; b: number }
    }>
  }
}

export interface IGroupWithData extends Omit<IGroup, 'users'> {
  users?: string[] | IUserWithData[]
}

export interface IProjectWithData
  extends Omit<IProject, 'avatar', 'owners', 'users', 'groups'> {
  avatar?: string | Buffer
  owners?: string[] | IUserWithData[]
  users?: string[] | IUserWithData[]
  groups?: string[] | IGroupWithData[]
}

export interface IUserWithData extends Omit<IUser, 'avatar'> {
  avatar?: string | Buffer
}

export interface IWorkspaceWithData
  extends Omit<IWorkspace, 'owners' | 'users' | 'groups'> {
  owners?: string[] | IUserWithData[]
  users?: string[] | IUserWithData[]
  groups?: string[] | IGroupWithData[]
}
