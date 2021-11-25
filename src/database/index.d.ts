import { IModel } from '@/models/index.d'

export interface IDataBaseEntry {
  key: string
  value: any
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
  summary?: {
    uuid?: string
    solids?: {
      uuid: string
      number: number
    }[]
    faces?: {
      uuid: string
      number: number
    }[]
    edges?: {}[]
  }
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

export interface ISimulationTask {
  index?: number
  label: string
  status: 'wait' | 'process' | 'finish' | 'error'
  pid?: string | number
  log?: string
  warning?: string
  error?: string
  systemLog?: string
  file?: {}
  files?: {
    fileName: string
  }[]
  plugin?: string
  datas?: Array<{ x: number; y: number }>
}

export interface INewSimulation {
  id: string
  name: string
  scheme: IModel
  project: string
}

export interface ISimulation {
  id: string
  name?: string
  scheme?: IModel
  tasks?: ISimulationTask[]
  project?: string
}

export interface ISystem {
  allowsignup?: boolean
  password?: {
    min: number
    max: number
    requireLetter: boolean
    requireNumber: boolean
    requireSymbol: boolean
  }
}

export interface INewUser {
  alreadyExists?: boolean
  id?: string
  email?: string
}

export interface IPlugin {
  uuid?: string
  key?: string
  category?: string
  client?: {
    name?: string
    description?: string
    models?: IModel[]
    needInit?: boolean
    needReInit?: boolean
    configuration?: {
      [key: string]: {
        label: string
        type: string
        required?: boolean
        options?: string[]
        default?: boolean | number | value
        value?: bollean | number | string
        props?: any
      }
    }
    data?: {
      [key: string]: any
    }
    inUseConfiguration?: {
      [key: string]: {
        label: string
        value?: boolean | number | string
      }
    }
  }
  server?: {
    lib?: {
      init?: Function
      computeSimulation: Function
      stop: Function
    }
    templates?: Array<{ key: string; file: string }>
  }
}

export interface IServerPlugin extends Omit<IPlugin, 'client' | 'server'> {
  lib?: IPlugin['server']['lib']
  templates?: IPlugin['server']['templates']
}

export interface IClientPlugin extends Omit<IPlugin, 'client' | 'server'> {
  name?: IPlugin['client']['name']
  description?: IPlugin['client']['description']
  models?: IPlugin['client']['models']
  needInit?: IPlugin['client']['needInit']
  needReInit?: IPlugin['client']['needReInit']
  configuration?: IPlugin['client']['configuration']
  data?: IPlugin['client']['data']
  inUseConfiguration?: IPlugin['client']['inUseConfiguration']
  data?: {}
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
  plugins?: Array<IPlugin>
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
