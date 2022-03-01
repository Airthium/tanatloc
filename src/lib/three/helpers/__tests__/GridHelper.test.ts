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
  const scene = new Scene() as Scene & {
    boundingBox: Box3
    boundingSphere: Sphere
  }
  scene.boundingBox = new Box3(
    new Vector3(-1e-5, -3, -1e-13),
    new Vector3(1, 1, 1)
  )
  scene.boundingSphere = new Sphere(new Vector3(0, 0, 0), 1)
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
            geometry: {
              dispose: jest.fn
            },
            material: {
              dispose: jest.fn
            }
          }
        ]
      }
    ]
    const grid = GridHelper(scene)
    grid.update()
    grid.dispose()
  })
})
