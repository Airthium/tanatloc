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
  default: boolean | number | string
  options?: { label: string; value: string }[]
  unit?: string
}

export interface IModelBoundaryCondition {
  label: string
  htmlEntity: string
  default: boolean | number | string
  unit?: string
}

export interface IModelInitialization {
  label: string
  htmlEntity: string
  default: boolean | number | string
  unit: string
}

export interface IModelInitializationCoupling {
  label: string
  compatibility: {
    algorithm: string
    filter: {
      name: string
      prefixPattern: string | RegExp
      suffixPattern: string | RegExp
      pattern: string | RegExp
      multiplicator?: string[]
    }
  }[]
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
    }
    materials?: {
      index: number
      title: string
      done?: boolean
      children: IModelMaterial[]
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
        | {
            label: string
            children: IModelInitialization[]
          }
        | IModelInitializationCoupling
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
          }
    }
    run?: {
      index: number
      title: string
      done?: boolean
      results: { name: string }[]
      resultsFilters?: {
        name: string
        prefixPattern: string | RegExp
        suffixPattern: string | RegExp
        pattern: string | RegExp
        multiplicator?: string[]
      }[]
    }
  }
}
