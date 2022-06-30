import { Box3, Scene, Sphere, Vector3 } from 'three'

import { PointHelper } from '../PointHelper'

describe('lib/three/helpers/PointHelper', () => {
  const mockAdd = jest.fn()
  const scene = {} as Scene & { boundingBox: Box3; boundingSphere: Sphere }
  scene.add = mockAdd
  scene.boundingBox = {
    min: {
      x: 0,
      y: 0,
      z: 0
    } as Vector3,
    max: {
      x: 1,
      y: 2,
      z: 3
    } as Vector3
  } as Box3

  beforeEach(() => {
    mockAdd.mockReset()
  })

  test('constructor', () => {
    const pointHelper = PointHelper(scene)
    expect(pointHelper).toBeDefined()
    expect(pointHelper.build).toBeDefined()
    expect(pointHelper.update).toBeDefined()
    expect(pointHelper.dispose).toBeDefined()

    expect(scene.add).toHaveBeenCalledTimes(1)
  })

  test('build', () => {
    const pointHelper = PointHelper(scene)
    pointHelper.build()
  })

  test('update', () => {
    const pointHelper = PointHelper(scene)

    pointHelper.build()

    pointHelper.update({ x: 1, y: 2, z: 3 } as Vector3)
    pointHelper.update()
  })

  test('dispose', () => {
    //@ts-ignore
    global.MockGroup.children = [
      { geometry: { dispose: jest.fn() }, material: { dispose: jest.fn() } }
    ]
    const pointHelper = PointHelper(scene)

    pointHelper.dispose()
  })
})
