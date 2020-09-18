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

jest.mock('../../../../../src/lib/three/helpers/GridHelper', () => ({
  GridHelper: () => ({
    update: () => {},
    setVisible: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/SelectionHelper', () => ({
  SelectionHelper: () => ({
    start: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/SectionViewHelper', () => ({
  SectionViewHelper: () => ({
    getClippingPlane: () => {},
    start: () => {},
    update: () => {},
    stop: () => {}
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
    type: 'Mesh',
    material: {}
  },
  {
    visible: true,
    type: 'Mesh',
    geometry: {
      boundingBox: {
        min: { x: 0, y: 0, z: 0 },
        max: { x: 1, y: 1, z: 1 }
      },
      boundingSphere: {}
    },
    material: {}
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

  it('grid visible', () => {
    wrapper.find('Switch').at(0).props().onChange(true)
    wrapper.find('Switch').at(0).props().onChange(false)
  })

  it('transparent', () => {
    act(() => {
      const event = {}

      wrapper.find('Switch').at(2).props().onChange(false)
      // To add a geometry
      wrapper.find('Button').forEach((button) => {
        if (button.props().onClick) button.props().onClick(event)
      })

      wrapper.find('Switch').at(2).props().onChange(true)
      // To add a geometry
      wrapper.find('Button').forEach((button) => {
        if (button.props().onClick) button.props().onClick(event)
      })
    })
  })
})
