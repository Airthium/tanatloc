import Background from '../../../components/background'
import { mount } from 'enzyme'

let mockAnimationCount = 0
window.requestAnimationFrame = (callback) => {
  mockAnimationCount++
  if (mockAnimationCount === 1) callback()
}

global.MockScene.children = [
  {
    rotation: {}
  },
  {
    rotation: {}
  }
]

let wrapper
describe('components/background', () => {
  beforeEach(() => {
    wrapper = mount(<Background />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('resize', () => {
    window.dispatchEvent(new Event('resize'))
  })

  it('pixelRatio', () => {
    wrapper.unmount()
    window.devicePixelRatio = undefined
    wrapper = mount(<Background />)
  })
})
