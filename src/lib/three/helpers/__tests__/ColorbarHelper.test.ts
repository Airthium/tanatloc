import { WebGLRenderer } from 'three'
import { Lut } from 'three/examples/jsm/math/Lut'
import { ColorbarHelper } from '../ColorbarHelper'

jest.mock('../LabelHelper', () => ({
  LabelHelper: () => ({
    scale: {},
    position: {
      set: jest.fn()
    }
  })
}))

const mockLUT = jest.fn()
jest.mock('three/examples/jsm/math/Lut', () => ({
  Lut: jest.fn().mockImplementation(() => mockLUT())
}))

describe('lib/three/helpers/ColorbarHelper', () => {
  const renderer = {} as WebGLRenderer
  renderer.domElement = {
    getBoundingClientRect: () => ({} as DOMRect)
  } as WebGLRenderer['domElement']
  renderer.setViewport = jest.fn
  renderer.render = jest.fn

  //@ts-ignore
  global.MockScene.children = [
    {
      remove: jest.fn(),
      children: [
        {
          type: 'LabelHelper',
          dispose: jest.fn()
        },
        {
          type: 'Sprite',
          dispose: jest.fn()
        }
      ]
    }
  ]

  beforeEach(() => {
    mockLUT.mockImplementation(() => ({
      setMin: jest.fn,
      setMax: jest.fn,
      setColorMap: jest.fn,
      minV: 0,
      maxV: 1,
      n: undefined,
      getColor: jest.fn,
      createCanvas: jest.fn
    }))
  })

  test('call', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    expect(colorbarHelper).toBeDefined()
  })

  test('setVisible', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    colorbarHelper.setVisible(true)
  })

  test('setColorMap', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    colorbarHelper.setColorMap('rainbow')
  })

  test('addLUT', () => {
    const lut = {} as Lut
    lut.createCanvas = jest.fn()

    const colorbarHelper = ColorbarHelper(renderer)
    lut.minV = 0.5
    lut.maxV = 1.5
    colorbarHelper.addLUT(lut)

    mockLUT.mockImplementation(() => ({
      setMin: jest.fn,
      setMax: jest.fn,
      setColorMap: jest.fn,
      minV: 0,
      maxV: 1,
      n: 512,
      getColor: jest.fn,
      createCanvas: jest.fn
    }))

    const colorbarHelper2 = ColorbarHelper(renderer)

    lut.minV = -1e-5
    lut.maxV = 1e-5
    colorbarHelper2.addLUT(lut)
  })

  test('getColor', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    colorbarHelper.getColor(1)
  })

  test('render', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    colorbarHelper.render()
  })

  test('dispose', () => {
    const colorbarHelper = ColorbarHelper(renderer)
    colorbarHelper.dispose()
  })
})
