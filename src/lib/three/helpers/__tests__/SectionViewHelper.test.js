import { SectionViewHelper } from '../SectionViewHelper'
import { Vector3 } from 'three/build/three.module'

describe('src/lib/three/helpers/SectionViewHelper', () => {
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
  })

  it('toAxis', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.toAxis(new Vector3())
  })

  it('flip', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.flip()
  })

  it('mouse', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    mouseDown({})
    mouseMove({})
    mouseUp({})

    sectionView.start()
    mouseDown({})
    mouseMove({})
    mouseUp({})

    global.MockRaycaster.intersectObjects = [
      {
        object: {
          material: {
            color: 'color'
          }
        }
      }
    ]
    mouseMove({})
    mouseDown({})

    global.MockRaycaster.intersectObjects = [
      {
        object: null
      }
    ]
    mouseMove({})
    mouseUp({})
    mouseMove({})
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
