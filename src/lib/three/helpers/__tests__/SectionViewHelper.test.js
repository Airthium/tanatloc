import { Vector3 } from 'three'
import { SectionViewHelper } from '../SectionViewHelper'

jest.mock('three/examples/jsm/controls/TransformControls', () => ({
  TransformControls: class {
    attach() {}
    detach() {}
    setMode() {}
  }
}))

describe('lib/three/helpers/SectionViewHelper', () => {
  let mouseDown
  let mouseMove
  let mouseUp

  const renderer = {
    domElement: {
      addEventListener: (type, callback) => {
        if (type === 'mousedown') mouseDown = callback
        else if (type === 'mousemove') mouseMove = callback
        else if (type === 'mouseup') mouseUp = callback
      },
      removeEventListener: () => {}
    },
    getSize: () => {}
  }
  const scene = {
    add: () => {},
    boundingBox: {
      getCenter: () => {},
      getSize: () => {}
    }
  }
  const camera = {}
  const controls = {
    stop: () => {}
  }
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
    sectionView.setMode('mode')
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
          dispose: () => {}
        },
        material: {
          dispose: () => {}
        }
      }
    ]
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.dispose()
  })
})
