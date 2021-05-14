import View from '@/components/project/view'
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

const mockError = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  Error: () => mockError()
}))

jest.mock('three/examples/jsm/postprocessing/RenderPass', () => ({
  RenderPass: class MockRenderPass {}
}))

jest.mock('three/examples/jsm/postprocessing/OutlinePass', () => ({
  OutlinePass: class MockRenderPass {
    constructor() {
      this.visibleEdgeColor = {
        set: () => {}
      }
      this.hiddenEdgeColor = {
        set: () => {}
      }
    }
  }
}))

jest.mock('three/examples/jsm/postprocessing/EffectComposer', () => ({
  EffectComposer: class MockEffectComposer {
    constructor() {
      this.addPass = () => {}
      this.render = () => {}
    }
  }
}))

jest.mock('three/examples/jsm/controls/TrackballControls', () => ({
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

jest.mock('@/lib/three/helpers/AxisHelper', () => ({
  AxisHelper: () => ({
    render: () => {},
    resize: () => {},
    dispose: () => {}
  })
}))

jest.mock('@/lib/three/helpers/NavigationHelper', () => ({
  NavigationHelper: () => ({
    render: () => {},
    resize: () => {},
    dispose: () => {}
  })
}))

jest.mock('@/lib/three/helpers/GridHelper', () => ({
  GridHelper: () => ({
    update: () => {},
    setVisible: () => {},
    dispose: () => {}
  })
}))

const mockSelectionEnabled = jest.fn()
jest.mock('@/lib/three/helpers/SelectionHelper', () => ({
  SelectionHelper: () => ({
    start: () => {},
    end: () => {},
    isEnabled: () => mockSelectionEnabled(),
    dispose: () => {}
  })
}))

jest.mock('@/lib/three/helpers/SectionViewHelper', () => ({
  SectionViewHelper: () => ({
    getClippingPlane: () => {},
    start: () => {},
    toggleVisible: () => {},
    toAxis: () => {},
    flip: () => {},
    setMode: () => {},
    stop: () => {},
    dispose: () => {}
  })
}))

jest.mock('@/lib/three/helpers/ColorbarHelper', () => ({
  ColorbarHelper: () => ({
    setVisible: () => {},
    setLUT: () => {},
    render: () => {}
  })
}))

jest.mock('@/lib/three/loaders/PartLoader', () => {
  let count = 0
  return {
    PartLoader: (mouseMove, mouseDown) => {
      mouseMove(
        {
          highlight: () => {}
        },
        'uuid'
      )
      mouseDown(
        {
          getSelected: () => ['uuid'],
          unselect: () => {}
        },
        'uuid'
      )
      mouseDown(
        {
          getSelected: () => ['uuid2'],
          select: () => {}
        },
        'uuid'
      )
      return {
        load: () => ({
          children: [
            {
              children: [
                {
                  userData: {},
                  material: {}
                }
              ]
            },
            {
              children: [
                {
                  userData: {},
                  material: {},
                  lut: count++ === 1 ? null : {}
                }
              ]
            },
            { children: [{ userData: {}, material: {} }] }
          ]
        }),
        dispose: () => {}
      }
    }
  }
})

const mockGet = jest.fn()
jest.mock('@/api/part', () => ({
  get: async () => mockGet()
}))

const mockEnabled = jest.fn(() => false)
jest.mock('react-redux', () => ({
  useSelector: (callback) =>
    callback({
      select: { enabled: mockEnabled(), highlighted: {}, selected: [{}] }
    }),
  useDispatch: () => () => {}
}))

jest.mock('@/store/select/action', () => ({
  highlight: jest.fn(),
  select: jest.fn(),
  unselect: jest.fn()
}))

let mockAnimationCount = 0
window.requestAnimationFrame = (callback) => {
  mockAnimationCount++
  if (mockAnimationCount < 10) callback()
}

global.MockScene.children = [
  { type: 'AmbientLight' },
  {
    type: 'PointLight',
    position: {
      multiplyScalar: () => {}
    }
  },
  { type: 'AxisHelper' },
  {
    type: 'Part',
    boundingBox: {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 1, y: 1, z: 1 }
    },
    material: {},
    dispose: () => {},
    setTransparent: () => {},
    startSelection: () => {},
    stopSelection: () => {},
    getSelected: () => [{}],
    highlight: () => {},
    select: () => {},
    unselect: () => {}
  },
  {
    visible: true,
    type: 'Part',
    boundingBox: {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 1, y: 1, z: 1 }
    },
    material: {},
    dispose: () => {},
    setTransparent: () => {},
    startSelection: () => {},
    stopSelection: () => {},
    getSelected: () => [{}],
    highlight: () => {},
    select: () => {},
    unselect: () => {}
  }
]

let mockState = false
mockUseState.mockImplementation(() => [mockState, () => {}])

window.setTimeout = (callback) => {
  if (callback.name !== '_flushCallback') callback()
}

let wrapper
describe('components/project/view', () => {
  beforeEach(() => {
    mockError.mockReset()

    mockGet.mockReset()
    mockState = false
    wrapper = mount(<View setPartSummary={() => {}} />)
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
    wrapper = mount(<View setPartSummary={() => {}} />)
  })

  it('grid visible', () => {
    wrapper.find('Switch').at(0).props().onChange(true)
    wrapper.find('Switch').at(0).props().onChange(false)
  })

  it('transparent', () => {
    wrapper.find('Switch').at(3).props().onChange(true)
    wrapper.find('Switch').at(3).props().onChange(false)
  })

  it('sectionView', () => {
    wrapper.unmount()
    mockState = true
    wrapper = mount(<View setPartSummary={() => {}} />)
    wrapper.find('Button').forEach((button) => {
      if (button.props().onClick) button.props().onClick()
    })
  })

  it('selection', () => {
    wrapper.find('Button').forEach((button) => {
      if (button.props().onClick) button.props().onClick()
    })

    mockSelectionEnabled.mockImplementation(() => true)
    wrapper.find('Button').forEach((button) => {
      if (button.props().onClick) button.props().onClick()
    })
  })

  it('handleTransform', () => {
    wrapper.unmount()
    mockState = true
    wrapper = mount(<View setPartSummary={() => {}} />)
    wrapper
      .find('.ant-radio-group')
      .parent()
      .props()
      .onChange({
        target: {
          value: 'value'
        }
      })
  })

  it('effect', () => {
    wrapper.unmount()
    const setPartSummary = jest.fn()

    mockGet.mockImplementation(() => {
      throw new Error()
    })
    wrapper = mount(
      <View
        simulation={{
          part: {}
        }}
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    mockGet.mockImplementation(() => ({ error: true }))
    wrapper = mount(
      <View
        simulation={{
          part: {}
        }}
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    mockGet.mockImplementation(() => ({}))
    wrapper = mount(
      <View
        simulation={{
          part: {}
        }}
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    mockGet.mockImplementation(() => ({
      solids: [
        {
          buffer:
            '{ "uuid": "uuid", "data": { "attributes": { "color": { "array": [0, 0, 1] } } } }'
        }
      ],
      faces: [
        {
          buffer:
            '{ "uuid": "uuid", "data": { "attributes": { "color": { "array": [0, 0, 1] } } } }'
        }
      ],
      edges: [
        {
          buffer:
            '{ "uuid": "uuid", "data": { "attributes": { "color": { "array": [0, 0, 1] } } } }'
        }
      ]
    }))
    wrapper = mount(
      <View
        simulation={{
          part: {}
        }}
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    wrapper = mount(
      <View
        simulation={{
          part: { needCleanup: true }
        }}
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    mockEnabled.mockImplementation(() => true)
    wrapper = mount(
      <View
        simulation={{
          part: {}
        }}
        setPartSummary={setPartSummary}
      />
    )
  })
})
