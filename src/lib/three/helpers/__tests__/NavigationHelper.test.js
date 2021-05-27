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
        normal: {
          clone: () => ({
            multiplyScalar: () => {}
          })
        },
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

describe('lib/three/helpers/NavigationHelper', () => {
  const renderer = {
    domElement: {
      addEventListener: (type, callback) => {
        callback({ target: { getBoundingClientRect: () => ({}) } })
        callback({
          clientX: 500,
          clientY: 500,
          target: {
            getBoundingClientRect: () => ({
              width: 150,
              height: 150,
              top: 0,
              left: 0
            })
          }
        })
        callback({
          clientX: 75,
          clientY: 75,
          target: {
            getBoundingClientRect: () => ({
              width: 150,
              height: 150,
              top: 0,
              left: 0
            })
          }
        })
        callback({
          clientX: 50,
          clientY: 50,
          target: {
            getBoundingClientRect: () => ({
              width: 150,
              height: 150,
              top: 0,
              left: 0
            })
          }
        })
        callback({
          clientX: 25,
          clientY: 25,
          target: {
            getBoundingClientRect: () => ({
              width: 150,
              height: 150,
              top: 0,
              left: 0
            })
          }
        })
      },
      removeEventListener: () => {}
    },
    getSize: (vector) => {
      vector.x = 150
      vector.y = 150
    },
    setViewport: () => {},
    render: () => {}
  }
  const scene = {
    boundingBox: {
      getCenter: () => {}
    }
  }
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

  test('call', () => {
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    expect(navigation).toBeDefined()
  })

  test('event', () => {
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    expect(navigation).toBeDefined()
  })

  test('resize', () => {
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    navigation.resize({
      newOffsetWidth: 0,
      newOffsetHeight: 0,
      newWidth: 0,
      newHeight: 0
    })
  })

  test('render', () => {
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    navigation.render()
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
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    navigation.dispose()
  })
})
