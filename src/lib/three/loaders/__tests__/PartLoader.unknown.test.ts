import { TGeometrySummary } from '@/database/geometry/get'
import { Plane, WebGLRenderer } from 'three'
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
const mockFinish = jest.fn(() => ({
  scene: {
    children: [
      {
        type: 'Mesh',
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
          uuid: 'uuidf1',
          label: 1
        },
        children: [
          {
            type: 'Mesh',
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
              uuid: 'uuide1',
              label: 1
            },
            traverse: jest.fn()
          },
          {
            type: 'Mesh',
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
              uuid: 'uuide2',
              label: 2
            },
            traverse: jest.fn()
          }
        ],
        traverse: jest.fn()
      }
    ],
    userData: {
      dimension: 2,
      type: 'unknown',
      faces: [{ uuid: 'uuidf1' }],
      edges: [{ uuid: 'uuide1' }, { uuid: 'uuide2' }]
    }
  }
}))
jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: class {
    setDRACOLoader = jest.fn()
    setKTX2Loader = jest.fn()
    load = (_: any, finish: Function, progress: Function, error: Function) => {
      progress('progress')
      mockGLTFError(error)
      finish(mockFinish())
    }
  }
}))

jest.mock('three/examples/jsm/loaders/DRACOLoader', () => ({
  DRACOLoader: class {
    setDecoderPath = jest.fn()
    preload = jest.fn()
  }
}))

jest.mock('three/examples/jsm/loaders/KTX2Loader', () => ({
  KTX2Loader: class {
    setTranscoderPath = jest.fn()
  }
}))

describe('lib/three/loaders/PartLoader', () => {
  global.URL.createObjectURL = jest.fn()
  //@ts-ignore
  global.MockGeometry.getAttribute = (attribute) => {
    if (attribute === 'position') return { array: [] }
  }
  //@ts-ignore
  global.MockObject3D.children = mockFinish().scene.children
  const part = {
    summary: {
      uuid: 'uuid',
      type: 'unknown',
      dimension: 2,
      faces: [{ uuid: 'uuidf1' }],
      edges: [{ uuid: 'uuide1' }, { uuid: 'uuide2' }]
    } as TGeometrySummary,
    buffer: Buffer.from([])
  }
  const clippingPlane = new Plane()
  const renderer = {} as WebGLRenderer
  renderer.domElement = {} as WebGLRenderer['domElement']
  //@ts-ignore
  renderer.domElement.addEventListener = () => undefined
  renderer.domElement.removeEventListener =
    jest.fn as WebGLRenderer['domElement']['removeEventListener']
  renderer.getSize = (vector) => vector
  const mouseMoveEvent = jest.fn()
  const mouseDownEvent = jest.fn()

  beforeEach(() => {
    mockGLTFError.mockImplementation(() => undefined)
  })

  test('call', () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    expect(partLoader).toBeDefined()
  })

  test('load', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    await partLoader.load(part, true, true, clippingPlane)
  })
})
