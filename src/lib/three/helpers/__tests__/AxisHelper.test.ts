import { PerspectiveCamera, WebGLRenderer } from 'three'
import { AxisHelper } from '../AxisHelper'

jest.mock('../ArrowHelper', () => () => ({
  rotateX: jest.fn,
  rotateZ: jest.fn
}))

jest.mock('../LabelHelper', () => ({
  LabelHelper: () => ({
    scale: {
      setScalar: jest.fn
    },
    position: {
      set: jest.fn
    }
  })
}))

describe('lib/three/helpers/AxisHelper', () => {
  const renderer = {} as WebGLRenderer
  renderer.setViewport = jest.fn
  renderer.render = jest.fn
  const camera = {} as PerspectiveCamera

  test('call', () => {
    const axis = AxisHelper(renderer, camera)
    expect(axis).toBeDefined()
  })

  test('resize', () => {
    const axis = AxisHelper(renderer, camera)
    axis.resize({
      newOffsetWidth: 0,
      newOffsetHeight: 0,
      newWidth: 0,
      newHeight: 0
    })
  })

  test('render', () => {
    const axis = AxisHelper(renderer, camera)
    axis.render()
  })

  test('dispose', () => {
    //@ts-ignore
    global.MockGroup.children = [{}, { type: 'ArrowHelper', dispose: jest.fn }]
    const axis = AxisHelper(renderer, camera)
    axis.dispose()
  })
})
