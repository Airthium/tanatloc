import { PartLoader } from '../PartLoader'

jest.mock('three/examples/jsm/math/Lut', () => ({
  Lut: class {
    setMin = () => {}
    setMax = () => {}
    getColor = () => ({
      r: 0,
      g: 0,
      b: 0
    })
  }
}))

jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: class {
    setDRACOLoader = jest.fn()
    load = (url, finish, progress, error) => {
      progress('progress')
      error('error')
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
                        uuid: 'face_uuid'
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
          uuid: 'solid_uuid',
          geometry: {
            dispose: () => {},
            boundingBox: {
              min: { x: 0, y: 0, z: 0 },
              max: { x: 1, y: 1, z: 1 }
            }
          },
          material: {
            dispose: () => {}
          }
        }
      ]
    },
    {
      children: [
        {
          uuid: 'face_uuid',
          geometry: {
            dispose: () => {},
            boundingBox: {
              min: { x: 0, y: 0, z: 0 },
              max: { x: 1, y: 1, z: 1 }
            }
          },
          material: {
            dispose: () => {}
          }
        }
      ]
    }
  ]
  const part = {
    buffer: Buffer.from([])
  }
  let mouseMove
  let mouseDown
  const renderer = {
    domElement: {
      addEventListener: (type, callback) => {
        if (type === 'pointermove') mouseMove = callback
        else if (type === 'pointerdown') mouseDown = callback
      },
      removeEventListener: () => {}
    },
    getSize: () => {}
  }
  const camera = {}
  const outlinePass = {}
  const mouseMoveEvent = jest.fn()
  const mouseDownEvent = jest.fn()

  test('call', () => {
    const partLoader = PartLoader()
    expect(partLoader).toBeDefined()
  })

  test('load', async () => {
    const partLoader = PartLoader()
    await partLoader.load(part)

    await partLoader.load(part, true)

    // With color
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0.1, 0.2, 0.3]
    })
    await partLoader.load(part)

    // No type
    part.type = 'other'
    await partLoader.load(part)
    await partLoader.load(part, true)

    // Mesh
    part.type = 'mesh'
    await partLoader.load(part)
    await partLoader.load(part, true)

    // Result
    part.type = 'result'
    await partLoader.load(part)

    global.MockGeometry.getAttribute = () => {}
    await partLoader.load(part, true)

    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0, 0, 0]
    })
    await partLoader.load(part)

    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 1, 1]
    })
    await partLoader.load(part)

    global.MockBox3.isEmpty = true
    await partLoader.load(part, true)
  })

  test('dispose', async () => {
    const partLoader = PartLoader()
    const mesh = await partLoader.load(part)
    mesh.dispose()
  })

  test('setTransparent', async () => {
    const partLoader = PartLoader()
    let mesh = await partLoader.load(part)
    mesh.setTransparent(true)
    mesh.setTransparent(false)
  })

  test('startSelection', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.startSelection(renderer, camera, outlinePass, 'solids')

    mesh.startSelection(renderer, camera, outlinePass, 'others')
  })

  test('stopSelection', async () => {
    const partLoader = PartLoader()
    const mesh = await partLoader.load(part)
    mesh.stopSelection()

    // Add selection
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.select('face_uuid')
    mesh.stopSelection()

    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.select('solid_uuid')
    mesh.stopSelection()
  })

  test('getHighlighted', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part)
    const highlighted = mesh.getHighlighted()
    expect(highlighted).toBe(null)
  })

  test('getSelected', async () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part)
    const selected = mesh.getSelected()
    expect(selected).toEqual([])
  })

  test('mouseMove', async () => {
    let current
    mouseMoveEvent.mockImplementation((p, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    global.MockRaycaster.intersectObjects = [
      { object: { userData: { uuid: 'uuid' } } }
    ]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    expect(current).toBe('uuid')
  })

  test('highlight', async () => {
    const partLoader = PartLoader()
    const mesh = await partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.highlight('face_uuid')
    mesh.highlight('face_uuid')
    mesh.highlight('uuid')
  })

  test('unhighlight', async () => {
    const partLoader = PartLoader()
    const mesh = await partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.unhighlight()

    // With selected
    mesh.select('face_uuid')
    mesh.highlight('face_uuid')
    mesh.unhighlight()
  })

  test('mouseDown', async () => {
    let current
    mouseDownEvent.mockImplementation((p, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = await partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(0)

    mesh.highlight('face_uuid')
    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(1)
    expect(current).toBe('face_uuid')
  })

  test('select', async () => {
    const partLoader = PartLoader()
    const mesh = await partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.select('face_uuid')
    mesh.select('uuid')

    expect(mesh.getSelected()).toEqual(['face_uuid'])
  })

  test('unselect', async () => {
    const partLoader = PartLoader()
    const mesh = await partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.select('face_uuid')
    mesh.unselect('uuid')
    mesh.unselect('face_uuid')
  })

  test('result specific', async () => {
    part.type = 'result'
    part.solids = []

    global.MockGroup.children = [
      { children: [] },
      {
        children: [
          {
            type: 'Group',
            boundingBox: {
              min: { x: 0, y: 0, z: 0 },
              max: { x: 1, y: 1, z: 1 }
            },
            children: [
              {
                uuid: 'face_uuid',
                geometry: {
                  dispose: () => {}
                },
                material: {
                  dispose: () => {}
                }
              },
              {}
            ]
          }
        ]
      }
    ]

    const partLoader = PartLoader()
    const mesh = await partLoader.load(part)

    mesh.setTransparent(true)
    mesh.setTransparent(false)

    mesh.dispose()
  })
})
