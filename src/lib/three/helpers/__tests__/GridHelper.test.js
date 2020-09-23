import { GridHelper } from '../GridHelper'

jest.mock('../LabelHelper', () => () => ({
  translateX: () => {},
  translateY: () => {},
  scale: {
    setScalar: () => {}
  }
}))

global.MockVector3 = { x: 3, y: 3, z: 3 }

describe('src/lib/three/helpers/GridHelper', () => {
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
        x: -1,
        y: -1,
        z: -1
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

  it('call', () => {
    const grid = GridHelper(scene)
    expect(grid).toBeDefined()
  })

  it('update', () => {
    const grid = GridHelper(scene)
    grid.update()
  })

  it('setVisible', () => {
    const grid = GridHelper(scene)
    grid.update()
    grid.setVisible(true)
  })

  it('dispose', () => {
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
