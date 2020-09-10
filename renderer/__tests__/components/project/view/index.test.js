import View from '../../../../components/project/view'
import { act } from 'react-dom/test-utils'
import { mount } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/controls/TrackballControls', () => ({
  TrackballControls: class MockTrackballControls {
    constructor() {
      this.target = {
        copy: () => {},
        clone: () => ({
          sub: () => ({
            normalize: () => ({
              multiplyScalar: () => {}
            })
          })
        })
      }
      this.update = () => {}
      this.object = {
        position: {
          distanceTo: () => {}
        }
      }
    }
  }
}))

jest.mock('../../../../../src/lib/three/helpers/AxisHelper', () => ({
  AxisHelper: () => ({
    render: () => {},
    resize: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/NavigationHelper', () => ({
  NavigationHelper: () => ({
    render: () => {},
    resize: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/SelectionHelper', () => ({
  SelectionHelper: () => ({
    start: () => {}
  })
}))

let mockAnimationCount = 0
window.requestAnimationFrame = (callback) => {
  mockAnimationCount++
  if (mockAnimationCount === 1) callback()
}

global.MockScene.children = [
  { type: 'AmbientLight' },
  { type: 'PointLight' },
  { type: 'AxisHelper' },
  {
    geometry: {
      boundingSphere: {}
    }
  }
]

let wrapper
describe('components/project/view', () => {
  beforeEach(() => {
    wrapper = mount(<View />)
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('render', () => {
    expect(wrapper).toBeDefined()
  })

  it('buttons', () => {
    act(() => {
      const event = {}
      wrapper.find('Button').forEach((button) => {
        if (button.props().onClick) button.props().onClick(event)
        if (button.props().onMouseDown) button.props().onMouseDown(event)
        if (button.props().onMouseMove) button.props().onMouseMove(event)
        if (button.props().onMouseUp) button.props().onMouseUp(event)
      })

      wrapper.find('Button').forEach((button) => {
        if (button.props().onClick) button.props().onClick(event)
        if (button.props().onMouseDown) button.props().onMouseDown(event)
        if (button.props().onMouseMove) button.props().onMouseMove(event)
        if (button.props().onMouseUp) button.props().onMouseUp(event)
      })
    })
  })

  it('drawers', () => {
    act(() => {
      const event = {}
      wrapper.find('Drawer').forEach((drawer) => {
        if (drawer.props().onClose) drawer.props().onClose(event)
      })
    })
  })

  it('resize', () => {
    window.dispatchEvent(new Event('resize'))
  })

  it('pixelRatio', () => {
    wrapper.unmount()
    window.devicePixelRatio = undefined
    wrapper = mount(<View />)
  })
})
