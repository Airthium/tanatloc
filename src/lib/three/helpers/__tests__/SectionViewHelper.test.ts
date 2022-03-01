import { Box3, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { SectionViewHelper } from '../SectionViewHelper'

jest.mock('three/examples/jsm/controls/TransformControls', () => ({
  TransformControls: jest.fn().mockImplementation(() => ({
    attach: jest.fn,
    detach: jest.fn,
    setMode: jest.fn
  }))
}))

describe('lib/three/helpers/SectionViewHelper', () => {
  let mouseDown
  let mouseMove
  let mouseUp

  const renderer: WebGLRenderer = {
    //@ts-ignore
    domElement: {
      addEventListener: (type, callback) => {
        if (type === 'mousedown') mouseDown = callback
        else if (type === 'mousemove') mouseMove = callback
        else if (type === 'mouseup') mouseUp = callback
      },
      removeEventListener: jest.fn
    },
    getSize: (vector) => vector
  }
  const scene = new Scene() as Scene & { boundingBox: Box3 }
  scene.boundingBox = new Box3()
  const camera = {} as PerspectiveCamera
  const controls = {} as TrackballControls
  test('call', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    expect(sectionView).toBeDefined()
  })

  test('getClippingPlane', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.getClippingPlane()
  })

  test('start', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.start()
  })

  test('toogleVisible', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.toggleVisible()
    sectionView.toggleVisible()
  })

  test('toAxis', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.toAxis(new Vector3())
  })

  test('flip', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.flip()
  })

  test('setMode', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.setMode('rotate')
  })

  test('mouse', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    mouseDown({})
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    mouseUp({})

    sectionView.start()
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    global.MockRaycaster.intersectObject = [{}]
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })

    mouseDown({})
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    mouseUp({})

    global.MockRaycaster.intersectObject = []
    mouseMove({ target: { getBoundingClientRect: () => ({}) } })
    mouseUp({})
  })

  test('stop', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.stop()
  })

  test('dispose', () => {
    global.MockGroup.children = [
      {
        geometry: {
          dispose: jest.fn
        },
        material: {
          dispose: jest.fn
        }
      }
    ]
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.dispose()
  })
})
