/** @module Models.Interface */

import { ISimulationTaskFile } from '@/database/simulation'
import { HPCClientPlugin } from '@/plugins/index.d'

type TValue = boolean | number | string

/**
 * Output
 */
export interface IOutput {
  type: 'VTU' | 'DATA' | 'COUPLING'
  name: string
  geometry?: string
  extra?: {
    name: string
    units: IUnit[]
    unit: IUnit
  }[]
}

/**
 * HTML entity
 */
export type IHtmlEntity = 'formula' | 'select' | 'checkbox' | 'radio'

/**
 * Model
 */
export interface IModel {
  userModelId?: string
  parallel?: boolean
  category: string | string[]
  name: string
  algorithm: string
  code: string
  sequential?: boolean
  version: string
  description: string
  variables?: IModelVariable[]
  customFreeFEMPlugins?: {
    path: string
    file: string
    headers?: string[]
    mpi?: boolean
  }[]
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

export interface IModelVariable {
  label: string
  value: string
  only3D?: boolean
}

/**
 * Common
 */
export interface IModelCommon {
  index: number
  title: string
  done?: boolean
  error?: string | Error
}

/**
 * Unit
 *
 * Adder should be used only in field with number only (no formula)
 */
export interface IUnit {
  label: string
  multiplicator?: number
  adder?: number
}

/**
 * Geometry
 */
export interface IModelGeometry extends IModelCommon {
  children: {
    label: string
    noMeshable?: true
    tag?: string
    dimension?: number
    value?: string
    data?: {
      file?: string
      name?: string
      path?: string
    }
    meshParameters?:
      | IModelMeshSizeManual
      | IModelMeshSizeAuto
      | IModelMeshSizeFactor
    mesh?: Partial<ISimulationTaskFile>
  }[]
}

export interface IModelMeshSize {
  refinements?: IModelMeshRefinement[]
}

export interface IModelMeshSizeManual extends IModelMeshSize {
  type: 'manual'
  value: number | string
  unit?: IUnit
}

export interface IModelMeshSizeAuto extends IModelMeshSize {
  type: 'auto'
  value: 'veryfine' | 'fine' | 'normal' | 'coarse' | 'verycoarse'
}

export interface IModelMeshSizeFactor extends IModelMeshSize {
  type: 'factor'
  value: number | string
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
  htmlEntity: IHtmlEntity
  default: number | string
  units?: IUnit[]
  unit?: IUnit
}

export interface IModelMaterialsValue {
  uuid: string
  material: {
    label: string
    children: {
      label: string
      symbol: string
      value: number | string
      unit?: IUnit
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
    | Error
    | IModelParametersGroup
    | undefined
}

export interface IModelParametersGroup {
  hidden?: boolean
  label: string
  advanced?: boolean
  children: IModelParameter[]
}

export interface IModelParameter {
  hidden?: boolean
  only3D?: boolean
  label: string
  label2D?: string
  htmlEntity: IHtmlEntity
  default: TValue
  default2D?: TValue
  options?: { label: string; value: string; value2D?: string }[]
  units?: IUnit[]
  unit?: IUnit
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
  htmlEntity: IHtmlEntity
  options?: { label: string; value: string }[]
  default: TValue
  units?: IUnit[]
  unit?: IUnit
  value?: TValue
}

export interface IModelInitializationCoupling {
  label: string
  compatibility: {
    algorithm: string
    map?: number[]
    filter: {
      name: string
      prefixPattern: string | RegExp
      suffixPattern: string | RegExp
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
  geometry: string
  point: { x: number; y: number; z: number }
  formula: string
}

/**
 * Boundary conditions
 */
export interface IModelBoundaryConditions extends IModelCommon {
  [type: string]:
    | boolean
    | number
    | string
    | Error
    | IModelTypedBoundaryCondition
    | undefined
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
  selected: { uuid: string; label: number }[]
  labels?: string
  values?: {
    checked?: boolean
    value?: number | string
    unit?: IUnit
  }[]
}

export interface IModelBoundaryCondition {
  label: string
  htmlEntity: IHtmlEntity
  default: number | string
  only3D?: boolean
  units?: IUnit[]
  unit?: IUnit
}

/**
 * Run
 */
export interface IModelRunResult {
  name: string
  data: string | string[]
  data2D?: string | string[]
  units?: IUnit[]
  unit?: IUnit
}

export interface IModelRun extends IModelCommon {
  results?: IModelRunResult[][]
  resultsFilter?: {
    name: string
    prefixPattern: string[] | RegExp[] | string | RegExp
    suffixPattern: string[] | RegExp[] | string | RegExp
    pattern: string[] | RegExp[] | string | RegExp
    multiplicator?: string[]
  }
  postprocessing?: {
    key: string
    parameters?: { key: string; value?: string; options?: string[] }[]
  }[]
  cloudServer?: HPCClientPlugin
  sensors?: IModelSensor[]
}
