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

describe('src/lib/three/helpers/AxisHelper', () => {
  const renderer = {
    setViewport: () => {},
    render: () => {}
  }
  const camera = {}

  it('call', () => {
    const axis = AxisHelper()
    expect(axis).toBeDefined()
  })

  it('resize', () => {
    const axis = AxisHelper()
    axis.resize({ newOffsetWidth: 0, newOffsetHeight: 0, width: 0, height: 0 })
  })

  it('render', () => {
    const axis = AxisHelper(renderer, camera)
    axis.render()
  })

  it('dispose', () => {
    global.MockGroup.children = [{}, { type: 'ArrowHelper', dispose: () => {} }]
    const axis = AxisHelper(renderer, camera)
    axis.dispose()
  })
})
