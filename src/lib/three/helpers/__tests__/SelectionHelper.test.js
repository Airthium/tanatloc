import { SelectionHelper } from '../SelectionHelper'

document.createElement = () => ({
  style: {}
})

describe('lib/three/helpers/SelectionHelper', () => {
  let mouseDown
  let mouseMove
  let mouseUp
  const renderer = {
    domElement: {
      getBoundingClientRect: () => ({}),
      addEventListener: (type, callback) => {
        if (type === 'pointerdown') mouseDown = callback
        else if (type === 'pointermove') mouseMove = callback
        else if (type === 'pointerup') mouseUp = callback
      },
      removeEventListener: () => {},
      parentElement: {
        appendChild: () => {}
      }
    },
    getSize: (vector) => {
      vector.x = 150
      vector.y = 150
    }
  }
  const camera = {
    position: {
      add: () => {},
      distanceTo: () => {}
    }
  }
  const scene = {}
  const controls = {
    target: {
      copy: () => ({
        add: () => {}
      }),
      clone: () => ({
        sub: () => ({
          normalize: () => ({
            multiplyScalar: () => {}
          })
        })
      })
    },
    stop: () => {}
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

    selection.start()
    mouseMove({ button: 0 })

    mouseDown({ button: 0 })
    mouseMove({ button: 0 })
    mouseUp({})
  })

  test('element parentElement', () => {
    document.createElement = () => ({
      style: {},
      parentElement: {
        removeChild: () => {}
      }
    })
    const selection = SelectionHelper(renderer, scene, camera, controls)
    selection.start()
    mouseDown({ button: 0 })
    mouseUp({})
  })

  test('raycaster', () => {
    global.MockRaycaster.intersectObjects = [{}]
    const selection = SelectionHelper(renderer, scene, camera, controls)
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
