/** @module Models.Interface */

import { IClientPlugin } from '@/database/index.d'

type TValue = boolean | number | string

export interface IModelMaterialValue {
  uuid: string
  material?: {
    label: string
    children: {
      label: string
      symbol: string
      value: number | string
    }[]
  }
  selected: { uuid: string; label: number | string }[]
}

export interface IModelMaterial {
  label: string
  name: string
  htmlEntity: string
  default: number
  unit: string
}

export interface IModelParameter {
  label: string
  label2D?: string
  htmlEntity: string
  default: TValue
  default2D?: TValue
  only3D?: boolean
  options?: { label: string; value: string; value2D?: string }[]
  unit?: string
  value?: TValue
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
  selected: { uuid: string; label: number | string }[]
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

export interface IModelInitialization {
  label: string
  htmlEntity: string
  only3D?: boolean
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
  type: string
  simulation?: string
  number?: number
  result?: string
  dat?: string
  mesh?: string
  values?: string[]
}

export interface IModel {
  category: string
  name: string
  algorithm: string
  code: string
  version: string
  description: string
  configuration: {
    dimension?: number
    geometry?: {
      index: number
      title: string
      done?: boolean
      meshable: boolean
      value?: string
      file?: string
      name?: string
      path?: string
      meshParameters?: {
        type: string
        value: string
      }
    }
    materials?: {
      index: number
      title: string
      done?: boolean
      children?: IModelMaterial[]
      values?: IModelMaterialValue[]
    }
    parameters?: {
      index: number
      title: string
      done?: boolean
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
    initialization?: {
      index: number
      title: string
      done?: boolean
      [key: string]:
        | boolean
        | number
        | string
        | IModelInitializationValue
        | {
            label: string
            children: IModelInitialization[]
          }
        | IModelInitializationCoupling
      value?: IModelInitializationValue
    }
    boundaryConditions?: {
      index: number
      title: string
      done?: boolean
      [type: string]: boolean | number | string | IModelTypedBoundaryCondition
    }
    run?: {
      index: number
      title: string
      done?: boolean
      error?: string | Error
      results?: { name: string }[]
      resultsFilter?: {
        name: string
        prefixPattern: string | RegExp
        suffixPattern: string | RegExp
        pattern: string | RegExp
        multiplicator?: string[]
      }
      cloudServer?: IClientPlugin
    }
  }
}
