import View from '../../../../components/project/view'
import { act } from 'react-dom/test-utils'
import React, { useState as mockUseState } from 'react'
import { mount } from 'enzyme'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => {}
  })
}))

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn()
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
    resize: () => {},
    dispose: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/NavigationHelper', () => ({
  NavigationHelper: () => ({
    render: () => {},
    resize: () => {},
    dispose: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/GridHelper', () => ({
  GridHelper: () => ({
    update: () => {},
    setVisible: () => {},
    dispose: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/SelectionHelper', () => ({
  SelectionHelper: () => ({
    start: () => {},
    dispose: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/helpers/SectionViewHelper', () => ({
  SectionViewHelper: () => ({
    getClippingPlane: () => {},
    start: () => {},
    toggleVisible: () => {},
    toAxis: () => {},
    flip: () => {},
    stop: () => {},
    dispose: () => {}
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

let mockState = false
mockUseState.mockImplementation(() => [mockState, () => {}])

let wrapper
describe('components/project/view', () => {
  beforeEach(() => {
    mockState = false
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
    const event = {}
    mockState = false
    wrapper.find('Button').at(5).props().onClick()
    wrapper.find('Switch').at(3).props().onChange(true)

    wrapper.unmount()
    mockState = true
    wrapper = mount(<View />)
    wrapper.find('Button').at(5).props().onClick()
  })

  it('sectionView', () => {
    wrapper.unmount()
    mockState = true
    wrapper = mount(<View />)
    wrapper.find('Button').forEach((button) => {
      if (button.props().onClick) button.props().onClick()
    })
  })
})
