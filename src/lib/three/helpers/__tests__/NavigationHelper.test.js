import { NavigationHelper } from '../NavigationHelper'

document.createElement = () => ({
  getContext: () => ({
    fillRect: () => {},
    fillText: () => {}
  })
})

document.addEventListener = (type, callback) => {
  callback({})
}

global.MockRaycaster.intersectObjects = [
  {
    object: {
      parent: {
        uuid: 'id',
        children: [
          {},
          {
            material: { color: 'color' }
          }
        ]
      }
    }
  }
]

describe('src/lib/three/helpers/NavigationHelper', () => {
  const renderer = {
    getSize: (vector) => {
      vector.x = 150
      vector.y = 150
    },
    setViewport: () => {},
    render: () => {}
  }
  const scene = {}
  const camera = {
    position: {
      copy: () => ({
        multiplyScalar: () => {}
      }),
      distanceTo: () => {}
    },
    up: {
      copy: () => {}
    }
  }
  const controls = {}

  it('call', () => {
    const navigation = NavigationHelper(renderer, camera, controls)
    expect(navigation).toBeDefined()
  })

  it('event', () => {
    document.addEventListener = (type, callback) => {
      callback({})
      callback({ clientX: 500, clientY: 500 })
      callback({ clientX: 75, clientY: 75 })
      callback({ clientX: 50, clientY: 50 })
      callback({ clientX: 25, clientY: 25 })
    }
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    expect(navigation).toBeDefined()
  })

  it('resize', () => {
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    navigation.resize({
      newOffsetWidth: 0,
      newOffsetHeight: 0,
      newWidth: 0,
      newHeight: 0
    })
  })

  it('render', () => {
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    navigation.render()
  })
})
