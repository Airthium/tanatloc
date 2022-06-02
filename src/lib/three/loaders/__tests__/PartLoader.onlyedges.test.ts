import { TGeometrySummary } from '@/database/geometry/get'
import { PerspectiveCamera, Plane, WebGLRenderer } from 'three'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { PartLoader } from '../PartLoader'

jest.mock('three/examples/jsm/math/Lut', () => ({
  Lut: jest.fn().mockImplementation(() => ({
    setMin: jest.fn,
    setMax: jest.fn,
    getColor: () => ({
      r: 0,
      g: 0,
      b: 0
    })
  }))
}))

const mockGLTFError = jest.fn()
jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: class {
    setDRACOLoader = jest.fn()
    load = (_: any, finish: Function, progress: Function, error: Function) => {
      progress('progress')
      mockGLTFError(error)
      finish({
        scene: {
          children: [
            {
              children: [
                null,
                null,
                {
                  children: [
                    {
                      geometry: {
                        boundingBox: {
                          min: {},
                          max: {}
                        },
                        dispose: jest.fn()
                      },
                      material: {
                        dispose: jest.fn()
                      },
                      userData: {
                        uuid: 'edge_uuid',
                        number: 'number'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
    }
  }
}))

jest.mock('three/examples/jsm/loaders/DRACOLoader', () => ({
  DRACOLoader: class {
    setDecoderPath = jest.fn()
    preload = jest.fn()
  }
}))

describe('lib/three/loaders/PartLoader', () => {
  global.URL.createObjectURL = jest.fn()
  const part = {
    summary: {} as TGeometrySummary,
    buffer: Buffer.from([])
  }
  const renderer = {} as WebGLRenderer
  renderer.domElement = {} as WebGLRenderer['domElement']
  renderer.domElement.addEventListener =
    jest.fn as WebGLRenderer['domElement']['addEventListener']
  renderer.domElement.removeEventListener =
    jest.fn as WebGLRenderer['domElement']['removeEventListener']
  renderer.getSize = (vector) => vector
  const camera = {} as PerspectiveCamera
  const outlinePass = {} as OutlinePass
  const clippingPlane = new Plane()
  const mouseMoveEvent = jest.fn()
  const mouseDownEvent = jest.fn()

  beforeEach(() => {
    mockGLTFError.mockImplementation(() => {
      // No callback
    })
  })

  test('call', () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    expect(partLoader).toBeDefined()
  })

  test('load', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    await partLoader.load(part, true, clippingPlane)

    await partLoader.load(part, true, clippingPlane)

    // With color
    //@ts-ignore
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0.1, 0.2, 0.3]
    })
    await partLoader.load(part, true, clippingPlane)

    //@ts-ignore
    global.MockGeometry.getAttribute = jest.fn
    await partLoader.load(part, true, clippingPlane)

    //@ts-ignore
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0, 0, 0]
    })
    await partLoader.load(part, true, clippingPlane)

    //@ts-ignore
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 1, 1]
    })
    await partLoader.load(part, true, clippingPlane)

    //@ts-ignore
    global.MockBox3.isEmpty = true
    await partLoader.load(part, true, clippingPlane)

    // GLTF error
    mockGLTFError.mockImplementation((callback) =>
      callback(new Error('gltf error'))
    )
    try {
      await partLoader.load(part, true, clippingPlane)
      expect(true).toBe(false)
    } catch (err: any) {
      expect(err.message).toBe('gltf error')
    }
  })

  test('highlight', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'edges')

    mesh.highlight('edge_uuid')
    mesh.highlight('edge_uuid')
    mesh.highlight('uuid')
  })
})
