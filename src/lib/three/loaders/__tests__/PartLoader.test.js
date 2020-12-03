import { PartLoader } from '../PartLoader'

describe('src/lib/three/loaders/PartLoader', () => {
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
            dispose: () => {}
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
        if (type === 'mousemove') mouseMove = callback
        else if (type === 'mousedown') mouseDown = callback
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
    global.MockGeometry.getAttribute = {
      array: [0.1, 0.2, 0.3]
    }
    partLoader.load(part)

    // Mesh
    part.type = 'mesh'
    partLoader.load(part)
  })

  it('dispose', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.dispose()
  })

  it('setTransparent', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.setTransparent(true)
    mesh.setTransparent(false)
  })

  it('startSelection', () => {
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mesh.startSelection(renderer, camera, outlinePass, 'solid')

    mesh.startSelection(renderer, camera, outlinePass, 'other')
  })

  //   mouseMove({ target: { getBoundingClientRect: () => ({}) } })
  //   mouseDown({})

  //   const mesh1 = { uuid: 'uuid', material: {} }
  //   const mesh2 = { uuid: 'uuid2', material: {} }
  //   global.MockRaycaster.intersectObjects = [{ object: mesh1 }]
  //   mouseMove({ target: { getBoundingClientRect: () => ({}) } })
  //   mouseMove({ target: { getBoundingClientRect: () => ({}) } })

  //   mouseDown({})
  //   mouseDown({})
  //   mouseDown({})

  //   global.MockRaycaster.intersectObjects = [{ object: mesh2 }]
  //   mouseMove({ target: { getBoundingClientRect: () => ({}) } })

  //   global.MockRaycaster.intersectObjects = [{ object: mesh1 }]
  //   mouseMove({ target: { getBoundingClientRect: () => ({}) } })

  //   mesh.stopSelection()
  //   mesh.startSelection(renderer, camera, outlinePass, 'solid')
  //   mesh.stopSelection()
  //   mesh.startSelection(renderer, camera, outlinePass, 'other')
  // })

  it('stopSelection', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.stopSelection()

    // Add selection
    mesh.startSelection(renderer, camera, outlinePass, 'face')
    mesh.select('face_uuid')
    mesh.stopSelection()

    mesh.startSelection(renderer, camera, outlinePass, 'solid')
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
    mouseMoveEvent.mockImplementation((part, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    global.MockRaycaster.intersectObjects = [{ object: { uuid: 'uuid' } }]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    expect(current).toBe('uuid')
  })

  it('highlight', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mesh.highlight('face_uuid')
    mesh.highlight('face_uuid')
    mesh.highlight('uuid')
  })

  it('unhighlight', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mesh.unhighlight()

    // With selected
    mesh.select('face_uuid')
    mesh.highlight('face_uuid')
    mesh.unhighlight()
  })

  it('mouseDown', () => {
    let current
    mouseDownEvent.mockImplementation((part, uuid) => (current = uuid))
    const partLoader = PartLoader(mouseMoveEvent, mouseDownEvent)
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

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
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mesh.select('face_uuid')
    mesh.select('uuid')

    expect(mesh.getSelected()).toEqual(['face_uuid'])
  })

  it('unselect', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mesh.select('face_uuid')
    mesh.unselect('uuid')
    mesh.unselect('face_uuid')
  })
})
