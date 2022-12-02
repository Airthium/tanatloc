/** @module Models.Interface */

import { ISimulationTaskFile } from '@/database/simulation'
import { IClientPlugin } from '@/plugins/index.d'

type TValue = boolean | number | string

/**
 * Model
 */
export interface IModel {
  user?: string
  category: string
  name: string
  algorithm: string
  code: string
  sequential?: boolean
  version: string
  description: string
  variables?: { name: string; value: string }[]
  configuration: {
    dimension?: number
    geometry: IModelGeometry
    materials?: IModelMaterials
    parameters: IModelParameters
    initialization?: IModelInitialization
    boundaryConditions: IModelBoundaryConditions
    run: IModelRun
  }
}

/**
 * Common
 */
export interface IModelCommon {
  index: number
  title: string
  done?: boolean
}

/**
 * Geometry
 */
export interface IModelGeometry extends IModelCommon {
  meshable: boolean
  multiple?: boolean
  n?: number
  dimension?: number
  value?: string
  values?: string[]
  data?: {
    file?: string
    name?: string
    path?: string
  }
  datas?: {
    file?: string
    name?: string
    path?: string
  }[]
  meshParameters?: {
    type: string
    value: string
  }
  mesh?: ISimulationTaskFile
  meshes?: ISimulationTaskFile[]
}

export interface IModelMeshRefinement {
  type: 'manual' | 'auto' | 'factor'
  value?: number
  factor?: number
  selected: { label: number | string }[]
}

/**
 * Materials
 */
export interface IModelMaterials extends IModelCommon {
  children: IModelMaterialsChild[]
  values?: IModelMaterialsValue[]
}

export interface IModelMaterialsChild {
  label: string
  name: string
  htmlEntity: string
  default: number
  unit: string
}

export interface IModelMaterialsValue {
  uuid: string
  material: {
    label: string
    children: {
      label: string
      symbol: string
      value: number | string
    }[]
  }
  geometry: string
  selected: { uuid: string; label: number }[]
}

/**
 * Parameters
 */
export interface IModelParameters extends IModelCommon {
  [key: string]:
    | boolean
    | number
    | string
    | {
        label: string
        advanced?: boolean
        children: IModelParameter[]
      }
}

export interface IModelParameter {
  only3D?: boolean
  label: string
  label2D?: string
  htmlEntity: string
  default: TValue
  default2D?: TValue
  options?: { label: string; value: string; value2D?: string }[]
  unit?: string
  value?: TValue
}

/**
 * Initialization
 */
export interface IModelInitialization extends IModelCommon {
  direct?: IModelInitializationDirect
  coupling?: IModelInitializationCoupling
  value?: IModelInitializationValue
}

export interface IModelInitializationDirect {
  label: string
  children: IModelInitializationDirectChild[]
}

export interface IModelInitializationDirectChild {
  only3D?: boolean
  label: string
  htmlEntity: string
  options?: { label: string; value: string }[]
  default: TValue
  unit?: string
  value?: TValue
}

export interface IModelInitializationCoupling {
  label: string
  compatibility: {
    algorithm: string
    map?: number[]
    filter: {
      name: string
      prefixPattern?: string | RegExp
      suffixPattern?: string | RegExp
      pattern: string | RegExp
      multiplicator?: string[]
    }
  }[]
}

export interface IModelInitializationValue {
  type: 'none' | 'direct' | 'coupling'
  simulation?: string
  number?: number
  result?: string
  dat?: string
  mesh?: string
  values?: string[]
}

export interface IModelSensor {
  name: string
  point: { x: number; y: number; z: number }
  formula: string
}

/**
 * Boundary conditions
 */
export interface IModelBoundaryConditions extends IModelCommon {
  [type: string]: boolean | number | string | IModelTypedBoundaryCondition
}

export interface IModelTypedBoundaryCondition {
  label: string
  refineFactor?: number
  children?: IModelBoundaryCondition[]
  values?: IModelBoundaryConditionValue[]
}

export interface IModelBoundaryConditionValue {
  uuid: string
  name: string
  type: {
    key: string
    label: string
    children?: IModelBoundaryCondition[]
  }
  geometry: string
  geometryIndex?: number
  selected: { uuid: string; label: number }[]
  values?: {
    checked?: boolean
    value?: TValue
  }[]
}

export interface IModelBoundaryCondition {
  label: string
  htmlEntity: string
  default: TValue
  only3D?: boolean
  unit?: string
}

/**
 * Run
 */
export interface IModelRun extends IModelCommon {
  error?: string | Error
  results?: { name: string }[]
  resultsFilter?: {
    name: string
    prefixPattern: string | RegExp
    suffixPattern: string | RegExp
    pattern: string | RegExp
    multiplicator?: string[]
  }
  postprocessing?: {
    key: string
    parameters?: { key: string; value?: string; options?: string[] }[]
  }[]
  cloudServer?: IClientPlugin
  sensors?: IModelSensor[]
}
