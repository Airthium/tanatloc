import Background from '@/components/background'
import { mount } from 'enzyme'

let mockAnimationCount = 0
window.requestAnimationFrame = (callback) => {
  mockAnimationCount++
  if (mockAnimationCount === 1) callback()
}

global.MockScene.children = [
  {
    rotation: {},
    geometry: {
      dispose: () => {}
    },
    material: {
      dispose: () => {}
    }
  },
  {
    rotation: {},
    geometry: {
      dispose: () => {}
    },
    material: {
      dispose: () => {}
    }
  }
]

let wrapper
describe('components/background', () => {
  // beforeEach(() => {
  //   wrapper = mount(<Background />)
  // })
  // afterEach(() => {
  //   wrapper.unmount()
  // })
  // test('render', () => {
  //   expect(wrapper).toBeDefined()
  // })
  // test('resize', () => {
  //   window.dispatchEvent(new Event('resize'))
  // })
  // test('pixelRatio', () => {
  //   wrapper.unmount()
  //   window.devicePixelRatio = undefined
  //   wrapper = mount(<Background />)
  // })
})
