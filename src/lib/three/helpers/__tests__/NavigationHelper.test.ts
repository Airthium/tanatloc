import { Box3, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { NavigationHelper } from '../NavigationHelper'

document.createElement = jest.fn().mockImplementation(() => ({
  getContext: () => ({
    fillRect: jest.fn,
    fillText: jest.fn
  })
}))

//@ts-ignore
document.addEventListener = (_: any, callback: Function) => {
  callback({})
}

//@ts-ignore
global.MockRaycaster.intersectObjects = [
  {
    object: {
      parent: {
        uuid: 'id',
        normal: {
          clone: () => ({
            multiplyScalar: jest.fn
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
  const getRect = () => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0
  })
  const renderer: WebGLRenderer = {
    //@ts-ignore
    domElement: {
      //@ts-ignore
      addEventListener: (_: any, callback: Function) => {
        callback({ target: { getBoundingClientRect: () => ({}) } })
        callback({
          clientX: 500,
          clientY: 500,
          target: {
            getBoundingClientRect: getRect
          }
        })
        callback({
          clientX: 75,
          clientY: 75,
          target: {
            getBoundingClientRect: getRect
          }
        })
        callback({
          clientX: 50,
          clientY: 50,
          target: {
            getBoundingClientRect: getRect
          }
        })
        callback({
          clientX: 25,
          clientY: 25,
          target: {
            getBoundingClientRect: getRect
          }
        })
      },
      removeEventListener: jest.fn
    },
    getSize: (vector) => {
      vector.x = 150
      vector.y = 150
      return vector
    },
    setViewport: jest.fn,
    render: jest.fn
  }
  const scene = {
    boundingBox: new Box3()
  } as Scene & { boundingBox: Box3 }
  const camera = {
    position: new Vector3(),
    up: new Vector3()
  } as PerspectiveCamera
  const controls = {} as TrackballControls

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
    //@ts-ignore
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
    const navigation = NavigationHelper(renderer, scene, camera, controls)
    navigation.dispose()
  })

  test('no intersect', () => {
    //@ts-ignore
    global.MockRaycaster.intersectObjects = []

    const navigation = NavigationHelper(renderer, scene, camera, controls)
    expect(navigation).toBeDefined()
  })
})
