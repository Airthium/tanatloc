import { Box3, Object3D, Scene, Sphere, Vector3 } from 'three'
import { GridHelper } from '../GridHelper'

jest.mock('../LabelHelper', () => () => ({
  translateX: jest.fn,
  translateY: jest.fn,
  scale: {
    setScalar: jest.fn
  }
}))

global.MockVector3 = { x: 1e5, y: 3, z: 1e-13 }

describe('lib/three/helpers/GridHelper', () => {
  const scene = {} as Scene & { boundingBox: Box3; boundingSphere: Sphere }
  scene.children = []
  scene.boundingBox = {
    min: { x: -1e-5, y: -3, z: -1e-13 } as Vector3,
    max: { x: 1, y: 1, z: 1 } as Vector3
  } as Box3
  scene.boundingSphere = {
    center: { x: 0, y: 0, z: 0 } as Vector3
  } as Sphere
  scene.children.push({
    type: 'Mesh'
  } as Object3D)
  scene.children.push({
    type: 'GridHelper',
    dispose: jest.fn
  } as Object3D & { dispose: any })
  scene.add = jest.fn()
  scene.remove = jest.fn()

  test('call', () => {
    const grid = GridHelper(scene)
    expect(grid).toBeDefined()
  })

  test('update', () => {
    const grid = GridHelper(scene)
    grid.update()
  })

  test('setVisible', () => {
    const grid = GridHelper(scene)
    grid.update()
    grid.setVisible(true)
  })

  test('dispose', () => {
    global.MockGroup.children = [
      {
        children: [
          {
            type: 'other'
          },
          {
            type: 'Line',
            geometry: {
              dispose: jest.fn
            },
            material: {
              dispose: jest.fn
            }
          },
          {
            type: 'LabelHelper',
            dispose: jest.fn
          }
        ]
      }
    ]
    const grid = GridHelper(scene)
    grid.update()
    grid.dispose()
  })
})
