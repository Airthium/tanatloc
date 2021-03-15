import { SectionViewHelper } from '../SectionViewHelper'
import { Vector3 } from 'three/build/three.module'

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
  it('call', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    expect(sectionView).toBeDefined()
  })

  it('getClippingPlane', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.getClippingPlane()
  })

  it('start', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.start()
  })

  it('toogleVisible', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.toggleVisible()
    sectionView.toggleVisible()
  })

  it('toAxis', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.toAxis(new Vector3())
  })

  it('flip', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.flip()
  })

  it('setMode', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.setMode('mode')
  })

  it('mouse', () => {
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

  it('stop', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.stop()
  })

  it('dispose', () => {
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
