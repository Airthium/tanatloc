/** @module Components.Editor.Steps.Utils */

import {
  IModel,
  IModelBoundaryConditions,
  IModelGeometry,
  IModelInitialization,
  IModelMaterials,
  IModelParameter,
  IModelRun,
  IModelTypedBoundaryCondition
} from '@/models/index.d'

/**
 * Check model
 * @param model Model
 */
export const checkModel = (model: IModel) => {
  if (!model.category) throw new Error('missing category')
  if (!model.name) throw new Error('missing name')
  if (!model.algorithm) throw new Error('missing algorithm')
  if (!model.code) throw new Error('missing code')
  if (!model.version) throw new Error('missing version')
  if (!model.description) throw new Error('missing description')
  if (!model.configuration) throw new Error('missing configuration')

  checkModelGeometry(model.configuration.geometry)
  checkModelMaterials(model.configuration.materials)
  checkModelParameters(model.configuration.parameters)
  checkModelInitialization(model.configuration.initialization)
  checkModelBoundaryConditions(model.configuration.boundaryConditions)
  checkModelRun(model.configuration.run)
}

/**
 * Check model common
 * @param common Common
 * @param key Key
 */
export const checkModelCommon = <
  T extends
    | 'geometry'
    | 'materials'
    | 'parameters'
    | 'initialization'
    | 'boundaryConditions'
    | 'run'
>(
  common: IModel['configuration'][T],
  key: T
) => {
  if (!common) return

  if (!common.index) throw new Error('missing configuration.' + key + '.index')
  if (!common.title) throw new Error('missing configuration.' + key + '.title')
}

/**
 * Check model geometry
 * @param geometry Geometry
 */
export const checkModelGeometry = (geometry: IModelGeometry) => {
  if (!geometry) throw new Error('missing configuration.geometry')
  checkModelCommon(geometry, 'geometry')
  if (geometry.meshable === undefined)
    throw new Error('missing configuration.geometry.meshable')
}

/**
 * Check model materials
 * @param materials Materials
 */
export const checkModelMaterials = (materials?: IModelMaterials) => {
  if (!materials) return
  checkModelCommon(materials, 'materials')

  if (!materials.children)
    throw new Error('missing configuration.materials.children')

  materials.children.forEach((material, index) => {
    if (!material.label)
      throw new Error(
        'missing configuration.materials.children[' + index + '].label'
      )
    if (!material.name)
      throw new Error(
        'missing configuration.materials.children[' + index + '].name'
      )
    if (!material.htmlEntity)
      throw new Error(
        'missing configuration.materials.children[' + index + '].htmlEntity'
      )
    if (material.default === undefined)
      throw new Error(
        'missing configuration.materials.children[' + index + '].default'
      )
    if (!material.unit)
      throw new Error(
        'missing configuration.materials.children[' + index + '].unit'
      )
  })
}

/**
 * Check model parameters
 * @param parameters Parameters
 */
export const checkModelParameters = (
  parameters: IModel['configuration']['parameters']
) => {
  if (!parameters) throw new Error('missing configuration.parameters')
  checkModelCommon(parameters, 'parameters')
  Object.keys(parameters).forEach((key) => {
    if (key === 'index' || key === 'title' || key === 'done') return

    const parameter = parameters[key] as {
      label: string
      advanced?: boolean
      children: IModelParameter[]
    }
    if (!parameter.label)
      throw new Error('missing configuration.parameters.' + key + '.label')
    if (!parameter.children)
      throw new Error('missing configuration.parameters.' + key + '.children')

    checkModelParameterChildren(parameter, key)
  })
}

/**
 * Check model parameter
 * @param parameter Parameter
 * @param key Key
 */
const checkModelParameterChildren = (
  parameter: {
    label: string
    advanced?: boolean
    children: IModelParameter[]
  },
  key: string
) => {
  parameter.children.forEach((child, index) => {
    if (!child.label)
      throw new Error(
        'missing configuration.parameters.' +
          key +
          '.children[' +
          index +
          '].label'
      )

    if (!child.htmlEntity)
      throw new Error(
        'missing configuration.parameters.' +
          key +
          '.children[' +
          index +
          '].htmlEntity'
      )

    if (child.default === undefined)
      throw new Error(
        'missing configuration.parameters.' +
          key +
          '.children[' +
          index +
          '].default'
      )
  })
}

/**
 * Check model initialization
 * @param initialization Initialization
 * @returns
 */
export const checkModelInitialization = (
  initialization?: IModelInitialization
) => {
  if (!initialization) return
  checkModelCommon(initialization, 'initialization')
}

/**
 * Check model boundary conditions
 * @param boundaryConditions Boundary conditions
 */
export const checkModelBoundaryConditions = (
  boundaryConditions: IModelBoundaryConditions
) => {
  if (!boundaryConditions)
    throw new Error('missing configuration.boundaryConditions')
  checkModelCommon(boundaryConditions, 'boundaryConditions')
  Object.keys(boundaryConditions).forEach((key) => {
    if (key === 'title' || key === 'index' || key === 'done') return

    const boundaryCondition = boundaryConditions[
      key
    ] as IModelTypedBoundaryCondition
    if (!boundaryCondition.label)
      throw new Error(
        'missing configuration.boundaryConditions.' + key + '.label'
      )
  })
}

/**
 * Check model run
 * @param run Run
 */
export const checkModelRun = (run: IModelRun) => {
  if (!run) throw new Error('missing configuration.run')
}
