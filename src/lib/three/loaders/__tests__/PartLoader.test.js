import { PartLoader } from '../PartLoader'

describe('src/lib/three/loaders/PartLoader', () => {
  global.MockGroup.children = [
    {
      children: [
        {
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
    solids: [
      {
        buffer: '{ "uuid": "id" }'
      }
    ],
    faces: [
      {
        buffer: '{ "uuid": "id" }'
      }
    ],
    edges: [
      {
        buffer: '{ "uuid": "id" }'
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
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    mouseDown({})

    const mesh1 = { uuid: 'uuid', material: {} }
    const mesh2 = { uuid: 'uuid2', material: {} }
    global.MockRaycaster.intersectObjects = [{ object: mesh1 }]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    mouseDown({})
    mouseDown({})
    mouseDown({})

    global.MockRaycaster.intersectObjects = [{ object: mesh2 }]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    global.MockRaycaster.intersectObjects = [{ object: mesh1 }]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    mesh.stopSelection()
    mesh.startSelection(renderer, camera, outlinePass, 'solid')
    mesh.stopSelection()
    mesh.startSelection(renderer, camera, outlinePass, 'other')
  })

  it('stopSelection', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.stopSelection()
  })

  it('highlight', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.startSelection(renderer, camera, outlinePass, 'face')

    mesh.highlight({})
    mesh.highlight({ material: {} })
  })

  it('select', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.select({})
    mesh.select({ material: {} })
  })

  it('unselect', () => {
    const partLoader = PartLoader()
    const mesh = partLoader.load(part)
    mesh.unselect({})
    mesh.unselect({ material: {} })
  })
})
