import { ColorbarHelper } from '../ColorbarHelper'

jest.mock('../LabelHelper', () => () => ({
  scale: {},
  position: {
    set: jest.fn()
  }
}))

describe('src/lib/three/helpers/ColorbarHelper', () => {
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
      material: {
        dispose: jest.fn()
      }
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
      createCanvas: jest.fn()
    })
  })

  it('render', () => {
    const colorbarHelper = ColorbarHelper(renderer, scene)
    colorbarHelper.render()
  })
})
