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
  let mouseDown: Function
  let mouseMove: Function
  let mouseUp: Function

  const renderer: WebGLRenderer = {
    //@ts-ignore
    domElement: {
      //@ts-ignore
      addEventListener: (type: string, callback: Function) => {
        if (type === 'pointerdown') mouseDown = callback
        else if (type === 'pointermove') mouseMove = callback
        else if (type === 'pointerup') mouseUp = callback
      },
      removeEventListener: jest.fn
    },
    getSize: (vector) => vector
  }
  const scene = new Scene() as Scene & { boundingBox: Box3 }
  scene.boundingBox = new Box3()
  const camera = {} as PerspectiveCamera
  camera.getWorldDirection = jest.fn()
  const controls = {} as TrackballControls
  //@ts-ignore
  controls.object = {
    position: new Vector3()
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
    sectionView.toAxis(new Vector3(1, 0, 0))
    sectionView.toAxis(new Vector3(1, 0, 0))
  })

  test('toAxis - equal', () => {
    //@ts-ignore
    global.MockVector3.equals = () => true
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.toAxis(new Vector3(1, 0, 0))
  })

  test('flip', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.flip()
  })

  test('stop', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.stop()
  })

  test('dispose', () => {
    //@ts-ignore
    global.MockGroup.children = [
      {
        type: 'Plane',
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

  test('dispose - other child', () => {
    //@ts-ignore
    global.MockGroup.children = [
      {
        type: 'Other'
      }
    ]

    const sectionView = SectionViewHelper(renderer, scene, camera, controls)
    sectionView.dispose()
  })

  test('mouse', () => {
    const sectionView = SectionViewHelper(renderer, scene, camera, controls)

    mouseMove({})
    mouseDown({})
    mouseMove({})
    mouseUp({})

    sectionView.start()
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })
    mouseDown({})

    // With intersect (Plane)
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      {
        object: {
          type: 'Plane',
          material: { color: { set: jest.fn() } }
        },
        point: {}
      }
    ]
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // highlight again
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // Down
    mouseDown({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // Plane move
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // Up
    mouseUp()

    // With intersect (Dome)
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      {
        object: {
          type: 'Dome',
          material: { color: { set: jest.fn() } }
        },
        point: {}
      }
    ]
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    mouseDown({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // Dome move
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // Up
    mouseUp()

    // With intersect (Arc)
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      {
        object: {
          type: 'ArcX',
          material: { color: { set: jest.fn() } },
          getWorldDirection: jest.fn()
        },
        point: {}
      }
    ]
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    mouseDown({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // Arc move
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    // Up
    mouseUp()

    // With intersect (ArcY)
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      {
        object: {
          type: 'ArcY',
          material: { color: { set: jest.fn() } },
          getWorldDirection: jest.fn()
        },
        point: {}
      }
    ]
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    mouseDown({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    mouseUp()

    // With intersect (Other)
    //@ts-ignore
    global.MockRaycaster.intersectObject = [
      {
        object: {
          type: 'Other',
          material: { color: { set: jest.fn() } },
          getWorldDirection: jest.fn()
        },
        point: {}
      }
    ]
    mouseMove({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    mouseDown({
      clientX: 0.75,
      clientY: 0.25,
      target: {
        getBoundingClientRect: () => ({ width: 1, height: 1, left: 0, top: 0 })
      }
    })

    mouseUp()
  })
})
