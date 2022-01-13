import { IClientPlugin } from '@/database/index.d'

type TValue = boolean | number | string

export interface IModelMaterialValue {
  uuid: string
  material?: {
    label: string
    children: {
      label: string
      symbol: string
      value: string
    }[]
  }
  selected: { uuid: string; label: number }[]
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
  htmlEntity: string
  default: TValue
  options?: { label: string; value: string }[]
  unit?: string
  value?: TValue
}

export interface IModelBoundaryConditionValue {
  uuid: string
  name: string
  type: {
    key: string
    label: string
    children?: IModelBoundaryCondition[]
  }
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
  unit?: string
}

export interface IModelInitialization {
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
  type: string
  simulation?: string
  result?: string
  dat?: string
  mesh?: string
}

export interface IModel {
  category: string
  name: string
  algorithm: string
  code: string
  version: string
  description: string
  configuration: {
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
      [key: string]:
        | boolean
        | number
        | string
        | {
            label: string
            refineFactor?: number
            children?: IModelBoundaryCondition[]
            values?: IModelBoundaryConditionValue[]
          }
    }
    run?: {
      index: number
      title: string
      done?: boolean
      error?: string | Error
      results?: { name: string }[]
      resultsFilters?: {
        name: string
        prefixPattern: string | RegExp
        suffixPattern: string | RegExp
        pattern: string | RegExp
        multiplicator?: string[]
      }[]
      cloudServer?: IClientPlugin
    }
  }
}
