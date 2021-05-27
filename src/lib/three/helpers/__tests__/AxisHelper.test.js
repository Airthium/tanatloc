import { AxisHelper } from '../AxisHelper'

jest.mock('../ArrowHelper', () => () => ({
  rotateX: () => {},
  rotateZ: () => {}
}))

jest.mock('../LabelHelper', () => () => ({
  scale: {
    setScalar: () => {}
  },
  position: {
    set: () => {}
  }
}))

describe('lib/three/helpers/AxisHelper', () => {
  const renderer = {
    setViewport: () => {},
    render: () => {}
  }
  const camera = {}

  test('call', () => {
    const axis = AxisHelper()
    expect(axis).toBeDefined()
  })

  test('resize', () => {
    const axis = AxisHelper()
    axis.resize({ newOffsetWidth: 0, newOffsetHeight: 0, width: 0, height: 0 })
  })

  test('render', () => {
    const axis = AxisHelper(renderer, camera)
    axis.render()
  })

  test('dispose', () => {
    global.MockGroup.children = [{}, { type: 'ArrowHelper', dispose: () => {} }]
    const axis = AxisHelper(renderer, camera)
    axis.dispose()
  })
})
