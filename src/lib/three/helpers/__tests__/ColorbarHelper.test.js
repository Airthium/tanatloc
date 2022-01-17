import { ColorbarHelper } from '../ColorbarHelper'

jest.mock('../LabelHelper', () => () => ({
  scale: {},
  position: {
    set: jest.fn()
  }
}))

jest.mock('three/examples/jsm/math/Lut', () => ({
  Lut: class {
    constructor() {
      this.setMin = jest.fn
      this.setMax = jest.fn
      this.minV = 0
      this.maxV = 1
      this.createCanvas = jest.fn
    }
  }
}))

describe('lib/three/helpers/ColorbarHelper', () => {
  const renderer = {
    domElement: {
      getBoundingClientRect: () => ({})
    },
    setViewport: jest.fn(),
    render: jest.fn()
  }
  const scene = {}

  global.MockScene.children = [
    {
      dispose: jest.fn()
    }
  ]

  test('call', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    expect(colorbarHelper).toBeDefined()
  })

  test('setVisible', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    colorbarHelper.setVisible(true)
  })

  test('setLUT', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    colorbarHelper.setLUT({
      createCanvas: jest.fn(),
      minV: 1,
      maxV: 1
    })

    colorbarHelper.setLUT({
      createCanvas: jest.fn(),
      minV: 1e-5,
      maxV: 1e-5
    })

    colorbarHelper.setLUT({
      createCanvas: jest.fn(),
      minV: 0,
      maxV: 0
    })
  })

  test('render', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    colorbarHelper.render()
  })
})
