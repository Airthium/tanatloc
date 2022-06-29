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
const mockFinish = jest.fn(() => ({
  scene: {
    children: [
      {
        type: 'Object3D',
        traverse: (callback: Function) => {
          callback({ type: 'Mesh', material: { color: 'red' } })
          callback({ type: 'Object3D' })
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
              uuid: 'uuidf1',
              label: 1
            }
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
              uuid: 'uuidf2',
              label: 2
            }
          }
        ],
        userData: {
          uuid: 'uuids1',
          label: 1
        }
      }
    ],
    userData: {
      dimension: 3,
      type: 'geometry3D',
      solids: [{ uuid: 'uuids1' }],
      faces: [{ uuid: 'uuidf1' }, { uuid: 'uuidf2' }]
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
      type: 'geometry3D',
      dimension: 3,
      solids: [{ uuid: 'uuids1' }],
      faces: [{ uuid: 'uuidf1' }, { uuid: 'uuidf2' }]
    } as TGeometrySummary,
    buffer: Buffer.from([])
  }
  const clippingPlane = new Plane()
  let mouseMove: Function
  let mouseDown: Function
  const renderer = {} as WebGLRenderer
  renderer.domElement = {} as WebGLRenderer['domElement']
  //@ts-ignore
  renderer.domElement.addEventListener = (type: string, callback: Function) => {
    if (type === 'pointermove') mouseMove = callback
    else if (type === 'pointerdown') mouseDown = callback
  }
  renderer.domElement.removeEventListener =
    jest.fn as WebGLRenderer['domElement']['removeEventListener']
  renderer.getSize = (vector) => vector
  const camera = {} as PerspectiveCamera
  const outlinePass = {} as OutlinePass
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

  test('dispose', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.dispose()
  })

  test('setTransparent', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    let mesh = await partLoader.load(part, true, clippingPlane)
    mesh.setTransparent(true)
    mesh.setTransparent(false)
  })

  test('startSelection', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.startSelection(renderer, camera, outlinePass, 'solids')

    mesh.startSelection(renderer, camera, outlinePass, 'edges')
  })

  test('stopSelection', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.stopSelection()

    // Add selection
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.select('uuidf1')
    mesh.stopSelection()

    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.select('uuids1')
    mesh.stopSelection()
  })

  test('getHighlighted', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, false, clippingPlane)
    const highlighted = mesh.getHighlighted()
    expect(highlighted).toBe(null)
  })

  test('getSelected', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    const selected = mesh.getSelected()
    expect(selected).toEqual([])
  })

  test('mouseMove - solids', async () => {
    let current
    mouseMoveEvent.mockImplementation((_, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'solids')

    // Empty
    //@ts-ignore
    global.MockRaycaster.intersectObject = []
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    // No parent
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      { object: { userData: { uuid: 'uuids1', label: 1 } } }
    ]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    // Parent
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      { object: { parent: { userData: { uuid: 'uuids1', label: 1 } } } }
    ]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    expect(current).toBe('uuids1')
  })

  test('mouseMove - faces', async () => {
    let current
    mouseMoveEvent.mockImplementation((_, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    // Empty
    //@ts-ignore
    global.MockRaycaster.intersectObject = []
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    // Ok
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      { object: { userData: { uuid: 'uuidf1', label: 1 } } }
    ]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    expect(current).toBe('uuidf1')
  })

  // test('mouseMove - default', async () => {
  //   const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
  //   const mesh = await partLoader.load(part, true, clippingPlane)
  //   mesh.startSelection(renderer, camera, outlinePass, 'default')

  //   mouseMove({ target: { getBoundingClientRect: () => ({}) } })
  // })

  test('highlight', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)

    // Solids
    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.highlight('uuids1')
    mesh.stopSelection()

    // Faces
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.highlight('uuidf1')
    mesh.highlight('uuidf1')
    mesh.highlight('uuid')
    mesh.stopSelection()
  })

  test('unhighlight', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)

    // Solids
    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.unhighlight()

    mesh.select('uuids1')
    mesh.highlight('uuids1')
    mesh.unhighlight()
    mesh.stopSelection()

    // Faces
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.unhighlight()

    mesh.select('uuidf1')
    mesh.highlight('uuidf1')
    mesh.unhighlight()
    mesh.stopSelection()
  })

  test('mouseDown', async () => {
    let current
    mouseDownEvent.mockImplementation((_, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(0)

    mesh.highlight('uuidf1')
    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(1)
    expect(current).toBe('uuidf1')
  })

  test('select', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)

    // Solids
    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.select('uuids1')
    mesh.stopSelection()

    // Faces
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.select('uuidf1')
    mesh.select('uuidf1')
    mesh.select('uuid')
    expect(mesh.getSelected()).toEqual([
      { uuid: 'uuidf1', label: 1 },
      { uuid: 'uuidf1', label: 1 }
    ])
    mesh.stopSelection()
  })

  test('unselect', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)

    // Solids
    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.select('uuids1')
    mesh.unselect('uuid')
    mesh.unselect('uuids1')

    // Faces
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.select('uuidf1')
    mesh.unselect('uuid')
    mesh.unselect('uuidf1')
  })
})
