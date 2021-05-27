import { GridHelper } from '../GridHelper'

jest.mock('../LabelHelper', () => () => ({
  translateX: () => {},
  translateY: () => {},
  scale: {
    setScalar: () => {}
  }
}))

global.MockVector3 = { x: 1e5, y: 3, z: 1e-13 }

describe('lib/three/helpers/GridHelper', () => {
  const scene = {
    children: [
      {
        type: 'Mesh'
      },
      {
        type: 'GridHelper',
        dispose: () => {}
      }
    ],
    boundingBox: {
      min: {
        x: -1e-5,
        y: -3,
        z: -1e-13
      },
      max: {
        x: 1,
        y: 1,
        z: 1
      }
    },
    boundingSphere: { center: {} },
    add: () => {},
    remove: () => {}
  }

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
              dispose: () => {}
            },
            material: {
              dispose: () => {}
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
