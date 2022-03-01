import { WebGLRenderer } from 'three'
import { Lut } from 'three/examples/jsm/math/Lut'
import { ColorbarHelper } from '../ColorbarHelper'

jest.mock('../LabelHelper', () => () => ({
  scale: {},
  position: {
    set: jest.fn()
  }
}))

jest.mock('three/examples/jsm/math/Lut', () => ({
  Lut: jest.fn().mockImplementation(() => ({
    setMin: jest.fn,
    setMax: jest.fn,
    minV: 0,
    maxV: 1,
    createCanvas: jest.fn
  }))
}))

describe('lib/three/helpers/ColorbarHelper', () => {
  const renderer = {} as WebGLRenderer
  renderer.domElement = {
    getBoundingClientRect: () => ({} as DOMRect)
  } as WebGLRenderer['domElement']
  renderer.setViewport = jest.fn
  renderer.render = jest.fn

  global.MockScene.children = [
    {
      dispose: jest.fn()
    }
  ]

  test('call', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    expect(colorbarHelper).toBeDefined()
  })

  test('setVisible', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    colorbarHelper.setVisible(true)
  })

  test('setLUT', () => {
    const lut = {} as Lut
    lut.createCanvas = jest.fn()

    const colorbarHelper = ColorbarHelper(renderer)
    lut.minV = 1
    lut.maxV = 1
    colorbarHelper.setLUT(lut)

    lut.minV = 1e-5
    lut.maxV = 1e-5
    colorbarHelper.setLUT(lut)

    lut.minV = 0
    lut.maxV = 0
    colorbarHelper.setLUT(lut)
  })

  test('render', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    colorbarHelper.render()
  })
})