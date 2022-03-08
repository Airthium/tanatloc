import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import { SelectionHelper } from '../SelectionHelper'

document.createElement = jest.fn().mockImplementation(() => ({
  style: {}
}))

describe('lib/three/helpers/SelectionHelper', () => {
  let mouseDown
  let mouseMove
  let mouseUp
  const renderer: WebGLRenderer = {
    domElement: {
      //@ts-ignore
      getBoundingClientRect: () => ({}),
      addEventListener: (type, callback) => {
        if (type === 'pointerdown') mouseDown = callback
        else if (type === 'pointermove') mouseMove = callback
        else if (type === 'pointerup') mouseUp = callback
      },
      removeEventListener: jest.fn,
      //@ts-ignore
      parentElement: {
        appendChild: jest.fn
      }
    },
    getSize: (vector) => {
      vector.x = 150
      vector.y = 150
      return vector
    }
  }
  const camera = {
    position: new Vector3(0, 0, 0)
  } as PerspectiveCamera
  const scene = {
    children: []
  } as Scene
  const controls: TrackballControls = {
    target: {
      copy: () => new Vector3(),
      clone: () => ({
        sub: () => ({
          normalize: () => ({
            //@ts-ignore
            multiplyScalar: jest.fn
          })
        })
      })
    },
    stop: jest.fn
  }

  test('call', () => {
    const selection = SelectionHelper(renderer, scene, camera, controls)
    expect(selection).toBeDefined()
  })

  test('events', () => {
    const selection = SelectionHelper(renderer, scene, camera, controls)
    mouseDown()
    mouseMove()
    mouseUp()

    // 0 size
    selection.start()
    mouseMove({ button: 0 })

    mouseDown({ button: 0 })
    mouseMove({ button: 0 })
    mouseUp({})

    // 10x size
    global.MockBox2.getSize = (vector) => {
      vector.x = 10
      vector.y = 0
    }
    selection.start()
    mouseDown({ button: 0 })
    mouseMove({ button: 0 })
    mouseUp({})

    // 10x 10y size, no part
    global.MockBox2.getSize = (vector) => {
      vector.x = 10
      vector.y = 10
    }
    selection.start()
    mouseDown({ button: 0 })
    mouseMove({ button: 0 })
    mouseUp({})
  })

  test('element parentElement', () => {
    document.createElement = jest.fn().mockImplementation(() => ({
      style: {},
      parentElement: {
        removeChild: jest.fn
      }
    }))
    const selection = SelectionHelper(
      renderer,
      { children: [{ type: 'Part' }] } as Scene,
      camera,
      controls
    )
    selection.start()
    mouseDown({ button: 0 })
    mouseUp({})
  })

  test('raycaster', () => {
    global.MockBox2.getSize = (vector) => {
      vector.x = 10
      vector.y = 100
    }
    const selection = SelectionHelper(
      renderer,
      { children: [{ type: 'Part' }] } as Scene,
      camera,
      controls
    )

    // No intersect
    global.MockRaycaster.intersectObject = []
    selection.start()
    mouseDown({ button: 0 })
    mouseUp({})

    // Intersect
    global.MockRaycaster.intersectObject = [{}]
    selection.start()
    mouseDown({ button: 0 })
    mouseUp({})
  })

  test('isEnabled', () => {
    const selection = SelectionHelper(renderer, scene, camera, controls)
    expect(selection.isEnabled()).toBe(false)
  })

  test('dispose', () => {
    const selection = SelectionHelper(renderer, scene, camera, controls)
    selection.dispose()
  })
})
