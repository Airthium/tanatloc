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
      removeEventListener: jest.fn,
      parentElement: {
        appendChild: jest.fn
      }
    },
    getSize: (vector) => {
      vector.x = 150
      vector.y = 150
    }
  }
  const camera = {
    position: {
      add: jest.fn,
      distanceTo: jest.fn
    }
  }
  const scene = {
    children: []
  }
  const controls = {
    target: {
      copy: () => ({
        add: jest.fn
      }),
      clone: () => ({
        sub: () => ({
          normalize: () => ({
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

    // 10x 10y size, no intersect
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
    document.createElement = () => ({
      style: {},
      parentElement: {
        removeChild: jest.fn
      }
    })
    const selection = SelectionHelper(renderer, scene, camera, controls)
    selection.start()
    mouseDown({ button: 0 })
    mouseUp({})
  })

  test('raycaster', () => {
    global.MockBox2.getSize = (vector) => {
      vector.x = 10
      vector.y = 10
    }
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
