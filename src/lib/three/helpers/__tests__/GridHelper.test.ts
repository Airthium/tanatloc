import { Box3, PerspectiveCamera, Scene, Sphere, WebGLRenderer } from 'three'
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

//@ts-ignore
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
  //@ts-ignore
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
            material: { dispose: jest.fn },
            scale: { setScalar: jest.fn }
          }
        ]
      },
      {
        children: [
          {
            type: 'LabelHelper',
            scale: { setScalar: jest.fn },
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
    const grid = GridHelper(renderer, scene, camera, controls)
    grid.update()
  })

  test('setVisible', () => {
    const grid = GridHelper(renderer, scene, camera, controls)
    grid.update()
    grid.setVisible(true)
    grid.update()
  })

  test('setScale', () => {
    const grid = GridHelper(renderer, scene, camera, controls)
    grid.setScale(1e3)
  })

  test('dispose', () => {
    const grid = GridHelper(renderer, scene, camera, controls)
    grid.update()
    grid.dispose()
  })
})
