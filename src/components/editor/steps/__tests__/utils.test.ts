import {
  checkModel,
  checkModelBoundaryConditions,
  checkModelCommon,
  checkModelGeometry,
  checkModelInitialization,
  checkModelMaterials,
  checkModelParameters,
  checkModelRun
} from '../utils'

describe('components/editor/steps/utils', () => {
  const model = {
    category: 'category',
    name: 'name',
    algorithm: 'algorithm',
    code: 'code',
    version: 'version',
    description: 'description',
    configuration: {
      geometry: { index: 1, title: 'Geometry', meshable: true },
      parameters: {
        index: 2,
        title: 'Parameters'
      },
      boundaryConditions: {
        index: 3,
        title: 'Boundary Conditions'
      },
      run: {
        index: 4,
        title: 'Run'
      }
    }
  }

  test('checkModel', () => {
    checkModel(model)

    // No category
    try {
      checkModel({
        ...model,
        //@ts-ignore
        category: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing category')
    }

    // No name
    try {
      checkModel({
        ...model,
        //@ts-ignore
        name: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing name')
    }

    // No algorithm
    try {
      checkModel({
        ...model,
        //@ts-ignore
        algorithm: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing algorithm')
    }

    // No code
    try {
      checkModel({
        ...model,
        //@ts-ignore
        code: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing code')
    }

    // No version
    try {
      checkModel({
        ...model,
        //@ts-ignore
        version: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing version')
    }

    // No description
    try {
      checkModel({
        ...model,
        //@ts-ignore
        description: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing description')
    }

    // No configuration
    try {
      checkModel({
        ...model,
        //@ts-ignore
        configuration: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration')
    }
  })

  test('checkModelCommon', () => {
    checkModelCommon(
      { index: 1, title: 'Geometry', meshable: true },
      'geometry'
    )

    // No common

    checkModelCommon(
      //@ts-ignore
      undefined,
      'geometry'
    )

    // No index
    try {
      checkModelCommon(
        {
          //@ts-ignore
          index: undefined,
          title: 'Geometry',
          meshable: true
        },
        'geometry'
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.geometry.index')
    }

    // No title
    try {
      checkModelCommon(
        {
          index: 1,
          //@ts-ignore
          title: undefined,
          meshable: true
        },
        'geometry'
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.geometry.title')
    }
  })

  test('checkModelGeometry', () => {
    checkModelGeometry(model.configuration.geometry)

    // No geometry
    try {
      checkModelGeometry(
        //@ts-ignore
        undefined
      )
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.geometry')
    }

    // No meshable
    try {
      checkModelGeometry({
        ...model.configuration.geometry,
        //@ts-ignore
        meshable: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.geometry.meshable')
    }
  })

  test('checkModelMaterials', () => {
    const materials = {
      index: 1,
      title: 'Materials',
      children: [
        {
          label: 'label',
          name: 'name',
          htmlEntity: 'html',
          default: 0,
          unit: 'unit'
        }
      ]
    }

    checkModelMaterials()

    checkModelMaterials(materials)

    // No children
    try {
      checkModelMaterials({
        ...materials,
        //@ts-ignore
        children: undefined
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.materials.children')
    }

    // No label
    try {
      checkModelMaterials({
        ...materials,
        children: [
          {
            ...materials.children[0],
            //@ts-ignore
            label: undefined
          }
        ]
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.materials.children[0].label'
      )
    }

    // No name
    try {
      checkModelMaterials({
        ...materials,
        children: [
          {
            ...materials.children[0],
            //@ts-ignore
            name: undefined
          }
        ]
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.materials.children[0].name'
      )
    }

    // No htmlEntity
    try {
      checkModelMaterials({
        ...materials,
        children: [
          {
            ...materials.children[0],
            //@ts-ignore
            htmlEntity: undefined
          }
        ]
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.materials.children[0].htmlEntity'
      )
    }

    // No default
    try {
      checkModelMaterials({
        ...materials,
        children: [
          {
            ...materials.children[0],
            //@ts-ignore
            default: undefined
          }
        ]
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.materials.children[0].default'
      )
    }

    // No unit
    try {
      checkModelMaterials({
        ...materials,
        children: [
          {
            ...materials.children[0],
            //@ts-ignore
            unit: undefined
          }
        ]
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.materials.children[0].unit'
      )
    }
  })

  test('checkParameters', () => {
    const parameters = model.configuration.parameters
    checkModelParameters(parameters)

    // No parameters
    try {
      //@ts-ignore
      checkModelParameters(undefined)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.parameters')
    }

    // No label
    try {
      checkModelParameters({
        ...parameters,
        //@ts-ignore
        key: {}
      })
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.parameters.key.label')
    }

    // No children
    try {
      checkModelParameters({
        ...parameters,
        //@ts-ignore
        key: {
          label: 'label'
        }
      })
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.parameters.key.children')
    }

    // No child label
    try {
      checkModelParameters({
        ...parameters,
        key: {
          label: 'label',
          children: [
            //@ts-ignore
            {}
          ]
        }
      })
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.parameters.key.children[0].label'
      )
    }

    // No child htmlEntity
    try {
      checkModelParameters({
        ...parameters,
        key: {
          label: 'label',
          children: [
            //@ts-ignore
            {
              label: 'label'
            }
          ]
        }
      })
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.parameters.key.children[0].htmlEntity'
      )
    }

    // No child default
    try {
      checkModelParameters({
        ...parameters,
        key: {
          label: 'label',
          children: [
            //@ts-ignore
            {
              label: 'label',
              htmlEntity: 'html'
            }
          ]
        }
      })
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.parameters.key.children[0].default'
      )
    }

    checkModelParameters({
      ...parameters,
      done: true,
      key: {
        label: 'label',
        children: [
          {
            label: 'label',
            htmlEntity: 'html',
            default: 0
          }
        ]
      }
    })
  })

  test('checkModelInitialization', () => {
    checkModelInitialization()

    checkModelInitialization({ index: 1, title: 'Initialization' })
  })

  test('checkModelBoudnaryConditions', () => {
    const boundaryConditions = model.configuration.boundaryConditions
    checkModelBoundaryConditions(boundaryConditions)

    // No boundaryConditions
    try {
      //@ts-ignore
      checkModelBoundaryConditions(undefined)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.boundaryConditions')
    }

    // No label
    try {
      //@ts-ignore
      checkModelBoundaryConditions({
        ...boundaryConditions,
        done: true,
        //@ts-ignore
        key: {}
      })
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe(
        'missing configuration.boundaryConditions.key.label'
      )
    }

    checkModelBoundaryConditions({
      ...boundaryConditions,
      done: true,
      key: {
        label: 'label'
      }
    })
  })

  test('checkModelRun', () => {
    try {
      //@ts-ignore
      checkModelRun(undefined)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('missing configuration.run')
    }

    checkModelRun(model.configuration.run)
  })
})
