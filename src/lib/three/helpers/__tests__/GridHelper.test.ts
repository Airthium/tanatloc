import {
  Box3,
  Object3D,
  PerspectiveCamera,
  Scene,
  Sphere,
  Vector3,
  WebGLRenderer
} from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { GridHelper } from '../GridHelper'

jest.mock('../LabelHelper', () => ({
  LabelHelper: () => ({
    translateX: jest.fn,
    translateY: jest.fn,
    position: {
      copy: jest.fn
    },
    scale: {
      setScalar: jest.fn
    }
  })
}))

global.MockVector3 = { x: 1e5, y: 3, z: 1e-13 }

describe('lib/three/helpers/GridHelper', () => {
  const renderer = {} as WebGLRenderer
  //@ts-ignore
  const scene = {
    children: [
      {
        type: 'GridHelper',
        children: [{}, {}, {}, {}, {}, {}],
        dispose: jest.fn
      },
      { type: 'other' }
    ],
    boundingBox: {
      min: { x: -1e-5, y: -3, z: -1e-13 },
      max: { x: 1, y: 1, z: 1 }
    },
    boundingSphere: {
      center: { x: 0, y: 0, z: 0 }
    },
    add: jest.fn,
    remove: jest.fn
  } as Scene & { boundingBox: Box3; boundingSphere: Sphere }

  const obj = {
    position: {
      set: jest.fn
    },
    children: []
  }
  global.MockGroup = {
    children: [
      obj,
      obj,
      obj,
      obj,
      obj,
      obj,
      {
        children: [
          {
            type: 'Line',

            geometry: { dispose: jest.fn },
            material: { dispose: jest.fn }
          }
        ]
      },
      {
        children: [
          {
            type: 'LabelHelper',
            dispose: jest.fn
          }
        ]
      }
    ]
  }

  //@ts-ignore
  const camera = {
    getWorldDirection: (v) => {
      v.x = -1
      v.y = 0.4
      v.z = 0.6
    }
  } as PerspectiveCamera
  //@ts-ignore
  const controls = {
    object: {
      position: {
        distanceTo: jest.fn
      }
    }
  } as TrackballControls

  test('call', () => {
    const grid = GridHelper(renderer, scene, camera, controls)
    expect(grid).toBeDefined()
  })

  test('update', () => {
    global.MockGroup.traverseChild = {
      type: 'LabelHelper',
      scale: { setScalar: jest.fn }
    }
    const grid = GridHelper(renderer, scene, camera, controls)
    grid.update()
  })

  test('setVisible', () => {
    global.MockGroup.traverseChild = {
      type: 'Line',
      scale: { setScalar: jest.fn }
    }
    const grid = GridHelper(renderer, scene, camera, controls)
    grid.update()
    grid.setVisible(true)
    grid.update()
  })

  test('dispose', () => {
    const grid = GridHelper(renderer, scene, camera, controls)
    grid.update()
    grid.dispose()
  })
})
