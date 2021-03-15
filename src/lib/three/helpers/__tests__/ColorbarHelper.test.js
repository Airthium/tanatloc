import { ColorbarHelper } from '../ColorbarHelper'

jest.mock('../LabelHelper', () => () => ({
  scale: {},
  position: {
    set: jest.fn()
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

  it('call', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    expect(colorbarHelper).toBeDefined()
  })

  it('setVisible', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    colorbarHelper.setVisible(true)
  })

  it('setLUT', () => {
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

  it('render', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    colorbarHelper.render()
  })
})
