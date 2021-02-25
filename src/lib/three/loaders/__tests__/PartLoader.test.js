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

describe('src/lib/three/loaders/PartLoader', () => {
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
    type: 'geometry',
    solids: [
      {
        buffer: '{ "uuid": "uuid"}'
      }
    ],
    faces: [
      {
        buffer: '{ "uuid": "uuid" }'
      }
    ],
    edges: [
      {
        buffer: '{ "uuid": "uuid" }'
      }
    ]
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

  it('call', () => {
    const partLoader = PartLoader()
    expect(partLoader).toBeDefined()
  })

  it('load', () => {
    const partLoader = PartLoader()
    partLoader.load(part)

    partLoader.load(part, true)

    // With color
    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0.1, 0.2, 0.3]
    })
    partLoader.load(part)

    // No type
    part.type = 'other'
    partLoader.load(part)
    partLoader.load(part, true)

    // Mesh
    part.type = 'mesh'
    partLoader.load(part)
    partLoader.load(part, true)

    // Result
    part.type = 'result'
    partLoader.load(part)

    global.MockGeometry.getAttribute = () => {}
    partLoader.load(part, true)

    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [0, 0, 0]
    })
    partLoader.load(part)

    global.MockGeometry.getAttribute = () => ({
      count: 3,
      array: [1, 1, 1]
    })
    partLoader.load(part)

    global.MockBox3.isEmpty = true
    partLoader.load(part, true)
  })

  it('dispose', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.dispose()
  })

  it('setTransparent', () => {
    const partLoader = PartLoader()
    let mesh = partLoader.load(part)
    mesh.setTransparent(true)
    mesh.setTransparent(false)
  })

  it('startSelection', () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.startSelection(renderer, camera, outlinePass, 'solids')

    mesh.startSelection(renderer, camera, outlinePass, 'others')
  })

  it('stopSelection', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.stopSelection()

    // Add selection
    mesh.startSelection(renderer, camera, outlinePass, 'faces')
    mesh.select('face_uuid')
    mesh.stopSelection()

    mesh.startSelection(renderer, camera, outlinePass, 'solids')
    mesh.select('solid_uuid')
    mesh.stopSelection()
  })

  it('getHighlighted', () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    const highlighted = mesh.getHighlighted()
    expect(highlighted).toBe(null)
  })

  it('getSelected', () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    const selected = mesh.getSelected()
    expect(selected).toEqual([])
  })

  it('mouseMove', () => {
    let current
    mouseMoveEvent.mockImplementation((p, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    global.MockRaycaster.intersectObjects = [{ object: { uuid: 'uuid' } }]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    expect(current).toBe('uuid')
  })

  it('highlight', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.highlight('face_uuid')
    mesh.highlight('face_uuid')
    mesh.highlight('uuid')
  })

  it('unhighlight', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.unhighlight()

    // With selected
    mesh.select('face_uuid')
    mesh.highlight('face_uuid')
    mesh.unhighlight()
  })

  it('mouseDown', () => {
    let current
    mouseDownEvent.mockImplementation((p, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(0)

    mesh.highlight('face_uuid')
    mouseDown()
    expect(mouseDownEvent).toHaveBeenCalledTimes(1)
    expect(current).toBe('face_uuid')
  })

  it('select', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.select('face_uuid')
    mesh.select('uuid')

    expect(mesh.getSelected()).toEqual(['face_uuid'])
  })

  it('unselect', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'faces')

    mesh.select('face_uuid')
    mesh.unselect('uuid')
    mesh.unselect('face_uuid')
  })

  it('result specific', () => {
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
    const mesh = partLoader.load(part)

    mesh.setTransparent(true)
    mesh.setTransparent(false)

    mesh.dispose()
  })
})
