export interface IDataBaseEntry {
  key: string
  value: string
  type?: string
  method?: string
  path?: Array<string>
}

export interface IDataBaseResponse {
  rows: Array<any>
}

export interface INewAvatar {
  id: string
  name: string
}

export interface IAvatar {
  id: string
  name?: string
  path?: string
}

export interface INewGeometry {
  id: string
  name: string
  originalfilename: string
  extension: string
  uploadfilename: string
}

export interface IGeometry {
  id: string
  name?: string
  originalfilename?: string
  extension?: string
  uploadfilename?: string
  glb?: string
  json?: string
  summary?: object
  project?: string
}

export interface INewGroup {
  id: string
  name: string
  users: Array<string>
  organization: string
}

export interface IGroup {
  id: string
  name?: string
  users?: Array<string>
  workspaces?: Array<string>
  projects?: Array<string>
  organization?: string
}

export interface INewLink {
  id: string
  type: string
  email: string
  userid?: string
}

export interface ILink {
  id: string
  type?: string
  email?: string
  userid?: string
}

export interface INewOrganization {
  id: string
  name: string
  owners: Array<string>
}

export interface IOrganization {
  id: string
  name?: string
  owners?: Array<string>
  users?: Array<string>
  groups?: Array<string>
}

export interface INewProject {
  id: string
  title: string
  description?: string
  owners: Array<string>
  workspace: string
}

export interface IProject {
  id: string
  archived?: boolean
  title?: string
  description?: string
  avatar?: string
  public?: boolean
  history?: object
  createddate?: Date
  lastaccess?: Date
  geometries?: Array<string>
  simulations?: Array<string>
  owners?: Array<string>
  users?: Array<string>
  groups?: Array<string>
  workspace?: string
}

export interface INewSimulation {
  id: string
  name: string
  scheme: object
  project: string
}

export interface ISimulation {
  id: string
  name?: string
  scheme?: object
  project?: string
}

export interface ISystem {
  allowsignup?: boolean
  password?: object
}

export interface INewUser {
  alreadyExists?: boolean
  id?: string
  email?: string
}

export interface IUser {
  id?: string
  lastname?: string
  firstname?: string
  email?: string
  avatar?: string
  isvalidated?: boolean
  lastmodificationdate?: Date
  superuser?: boolean
  passwordlastchanged?: Date
  organizations?: Array<string>
  workspaces?: Array<string>
  authorizedplugins?: Array<string>
  plugins?: Array<object>
}

export interface IUserCheck {
  id: string
  isvalidated: boolean
}

export interface INewWorkspace {
  id: string
  name: string
  owners: Array<string>
}

export interface IWorkspace {
  id: string
  name?: string
  owners?: Array<string>
  users?: Array<string>
  groups?: Array<string>
  projects?: Array<string>
  archivedprojects?: Array<object>
}