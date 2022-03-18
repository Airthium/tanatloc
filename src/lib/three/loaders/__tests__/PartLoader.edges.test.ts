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
    load = (_, finish, progress, error) => {
      progress('progress')
      mockGLTFError(error)
      finish({
        scene: {
          children: [
            {
              children: [
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
                        uuid: 'solid_uuid'
                      }
                    }
                  ]
                },
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
                        uuid: 'face_uuid',
                        number: 'number'
                      }
                    }
                  ]
                },
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
  global.MockGeometry.getAttribute = (attribute) => {
    if (attribute === 'position') return { array: [] }
  }
  global.MockGroup.children = [
    {
      children: [
        {
          userData: { uuid: 'solid_uuid', number: 'solid_number' },
          geometry: {
            dispose: jest.fn,
            boundingBox: {
              min: { x: 0, y: 0, z: 0 },
              max: { x: 1, y: 1, z: 1 }
            }
          },
          material: {
            dispose: jest.fn
          }
        }
      ]
    },
    {
      children: [
        {
          userData: { uuid: 'face_uuid', number: 'face_number' },
          geometry: {
            dispose: jest.fn,
            boundingBox: {
              min: { x: 0, y: 0, z: 0 },
              max: { x: 1, y: 1, z: 1 }
            }
          },
          material: {
            dispose: jest.fn
          }
        }
      ]
    }
  ]
  const part = {
    uuid: 'uuid',
    buffer: Buffer.from([])
  }
  const clippingPlane = new Plane()
  let mouseMove
  let mouseDown
  const renderer = {
    domElement: {
      addEventListener: (type, callback) => {
        if (type === 'pointermove') mouseMove = callback
        else if (type === 'pointerdown') mouseDown = callback
      },
      removeEventListener:
        jest.fn as WebGLRenderer['domElement']['removeEventListener']
    } as WebGLRenderer['domElement'],
    getSize: (vector) => vector
  } as WebGLRenderer
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

    await partLoader.load(part, true, clippingPlane)

    // With color
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0.1, 0.2, 0.3]
    })
    await partLoader.load(part, true, clippingPlane)

    global.MockGeometry.getAttribute = jest.fn
    await partLoader.load(part, true, clippingPlane)

    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0, 0, 0]
    })
    await partLoader.load(part, true, clippingPlane)

    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 1, 1]
    })
    await partLoader.load(part, true, clippingPlane)

    global.MockBox3.isEmpty = true
    await partLoader.load(part, true, clippingPlane)

    // GLTF error
    mockGLTFError.mockImplementation((callback) =>
      callback(new Error('gltf error'))
    )
    try {
      await partLoader.load(part, true, clippingPlane)
      expect(true).toBe(false)
    } catch (err) {
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

    mesh.startSelection(renderer, camera, outlinePass, 'others')
  })

  test('stopSelection', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.stopSelection()

    // Add selection
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.select('face_uuid')
    mesh.stopSelection()

    mesh.startSelection(renderer, camera, outlinePass, 'edges')
    mesh.select('edge_uuid')
    mesh.stopSelection()

    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.select('solid_uuid')
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

  test('mouseMove', async () => {
    let current
    mouseMoveEvent.mockImplementation((p, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'edges')

    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    global.MockRaycaster.intersectObjects = [
      { object: { userData: { uuid: 'uuid', number: 'number' } } }
    ]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    expect(current).toBe('uuid')
  })

  test('highlight', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'edges')

    mesh.highlight('edge_uuid')
    mesh.highlight('edge_uuid')
    mesh.highlight('uuid')
  })

  test('unhighlight', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'edges')

    mesh.unhighlight()

    // With selected
    mesh.select('edge_uuid')
    mesh.highlight('edge_uuid')
    mesh.unhighlight()
  })

  test('mouseDown', async () => {
    let current
    mouseDownEvent.mockImplementation((p, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'edges')

    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(0)

    mesh.highlight('edge_uuid')
    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(1)
    expect(current).toBe('edge_uuid')
  })

  test('select', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'edges')

    mesh.select('edge_uuid')
    mesh.select('edge_uuid')
    mesh.select('uuid')

    expect(mesh.getSelected()).toEqual([
      { uuid: 'edge_uuid', number: 'number' },
      { uuid: 'edge_uuid', number: 'number' }
    ])
  })

  test('unselect', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part, true, clippingPlane)
    mesh.startSelection(renderer, camera, outlinePass, 'edges')

    mesh.select('edge_uuid')
    mesh.unselect('uuid')
    mesh.unselect('edge_uuid')
  })
})
