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
    setMode: () => {},
    stop: () => {},
    dispose: () => {}
  })
}))

jest.mock('../../../../../src/lib/three/loaders/PartLoader', () => ({
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
      load: () => {},
      dispose: () => {}
    }
  }
}))

const mockGet = jest.fn()
jest.mock('../../../../../src/api/part', () => ({
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

jest.mock('../../../../store/select/action', () => ({
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
      normalize: () => ({
        multiplyScalar: () => {}
      })
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
    mockGet.mockReset()
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
    wrapper.find('Switch').at(3).props().onChange(true)
    wrapper.find('Switch').at(3).props().onChange(false)
  })

  it('sectionView', () => {
    wrapper.unmount()
    mockState = true
    wrapper = mount(<View />)
    wrapper.find('Button').forEach((button) => {
      if (button.props().onClick) button.props().onClick()
    })
  })

  it('handleTransform', () => {
    wrapper.unmount()
    mockState = true
    wrapper = mount(<View />)
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

    mockGet.mockImplementation(() => ({ error: true }))
    wrapper = mount(
      <View
        simulation={{
          scheme: { categories: { geometry: { file: { part: {} } } } }
        }}
        type="geometry"
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    mockGet.mockImplementation(() => ({}))
    wrapper = mount(
      <View
        simulation={{
          scheme: { categories: { geometry: { file: { part: {} } } } }
        }}
        type="geometry"
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    mockGet.mockImplementation(() => ({
      solids: [
        {
          buffer: '{"uuid": "uuid"}'
        }
      ],
      faces: [
        {
          buffer: '{"uuid": "uuid"}'
        }
      ],
      edges: [
        {
          buffer: '{"uuid": "uuid"}'
        }
      ]
    }))
    wrapper = mount(
      <View
        simulation={{
          scheme: { categories: { geometry: { file: { part: {} } } } }
        }}
        type="geometry"
        setPartSummary={setPartSummary}
      />
    )
    wrapper.unmount()

    mockEnabled.mockImplementation(() => true)
    wrapper = mount(
      <View
        simulation={{
          scheme: { categories: { geometry: { file: { part: {} } } } }
        }}
        type="geometry"
        setPartSummary={setPartSummary}
      />
    )
  })
})
