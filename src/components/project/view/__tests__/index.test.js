import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import View from '@/components/project/view'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
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
        set: jest.fn()
      }
      this.hiddenEdgeColor = {
        set: jest.fn()
      }
    }
  }
}))

jest.mock('three/examples/jsm/postprocessing/EffectComposer', () => ({
  EffectComposer: class MockEffectComposer {
    constructor() {
      this.addPass = jest.fn()
      this.render = jest.fn()
    }
  }
}))

jest.mock('three/examples/jsm/controls/TrackballControls', () => ({
  TrackballControls: class MockTrackballControls {
    constructor() {
      this.target = {
        copy: jest.fn(),
        clone: () => ({
          sub: () => ({
            normalize: () => ({
              multiplyScalar: jest.fn()
            })
          })
        })
      }
      this.update = jest.fn()
      this.object = {
        position: {
          distanceTo: jest.fn()
        }
      }
    }
  }
}))

jest.mock('@/lib/three/helpers/AxisHelper', () => ({
  AxisHelper: () => ({
    render: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn()
  })
}))

jest.mock('@/lib/three/helpers/NavigationHelper', () => ({
  NavigationHelper: () => ({
    render: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn()
  })
}))

jest.mock('@/lib/three/helpers/GridHelper', () => ({
  GridHelper: () => ({
    update: jest.fn(),
    setVisible: jest.fn(),
    dispose: jest.fn()
  })
}))

const mockSelectionEnabled = jest.fn()
jest.mock('@/lib/three/helpers/SelectionHelper', () => ({
  SelectionHelper: () => ({
    start: jest.fn(),
    end: jest.fn(),
    isEnabled: () => mockSelectionEnabled(),
    dispose: jest.fn()
  })
}))

jest.mock('@/lib/three/helpers/SectionViewHelper', () => ({
  SectionViewHelper: () => ({
    getClippingPlane: jest.fn(),
    start: jest.fn(),
    toggleVisible: jest.fn(),
    toAxis: jest.fn(),
    flip: jest.fn(),
    setMode: jest.fn(),
    stop: jest.fn(),
    dispose: jest.fn()
  })
}))

jest.mock('@/lib/three/helpers/ColorbarHelper', () => ({
  ColorbarHelper: () => ({
    setVisible: jest.fn(),
    setLUT: jest.fn(),
    render: jest.fn()
  })
}))

jest.mock('@/lib/three/loaders/PartLoader', () => {
  let count = 0
  return {
    PartLoader: (mouseMove, mouseDown) => {
      mouseMove(
        {
          highlight: jest.fn()
        },
        'uuid'
      )
      mouseDown(
        {
          getSelected: () => ['uuid'],
          unselect: jest.fn()
        },
        'uuid'
      )
      mouseDown(
        {
          getSelected: () => ['uuid2'],
          select: jest.fn()
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
        dispose: jest.fn()
      }
    }
  }
})

const mockAvatarAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAvatarAdd()
}))

const mockGet = jest.fn()
jest.mock('@/api/geometry', () => ({
  getPart: async () => mockGet()
}))

const mockEnabled = jest.fn(() => false)
jest.mock('react-redux', () => ({
  useSelector: (callback) =>
    callback({
      select: { enabled: mockEnabled(), highlighted: {}, selected: [{}] }
    }),
  useDispatch: () => jest.fn()
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
      multiplyScalar: jest.fn()
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
    dispose: jest.fn(),
    setTransparent: jest.fn(),
    startSelection: jest.fn(),
    stopSelection: jest.fn(),
    getSelected: () => [{}],
    highlight: jest.fn(),
    select: jest.fn(),
    unselect: jest.fn()
  },
  {
    visible: true,
    type: 'Part',
    boundingBox: {
      min: { x: 0, y: 0, z: 0 },
      max: { x: 1, y: 1, z: 1 }
    },
    material: {},
    dispose: jest.fn(),
    setTransparent: jest.fn(),
    startSelection: jest.fn(),
    stopSelection: jest.fn(),
    getSelected: () => [{}],
    highlight: jest.fn(),
    select: jest.fn(),
    unselect: jest.fn()
  }
]

window.setTimeout = (callback) => {
  if (callback.name !== '_flushCallback') callback()
}

describe('components/project/view', () => {
  const project = {}
  const geometry = {}

  beforeEach(() => {
    mockError.mockReset()

    mockAvatarAdd.mockReset()

    mockGet.mockReset()
    mockGet.mockImplementation(() => ({}))

    mockEnabled.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<View project={project} />)

    unmount()
  })

  test('geometry cleanup', () => {
    const { unmount } = render(
      <View project={project} geometry={{ needCleanup: true }} />
    )

    unmount()
  })

  test('with geometry error', async () => {
    mockGet.mockImplementation(() => {
      throw new Error()
    })
    const { unmount } = render(<View project={project} geometry={geometry} />)

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with geometry error 2', async () => {
    mockGet.mockImplementation(() => ({
      error: true,
      message: 'message'
    }))
    const { unmount } = render(<View project={project} geometry={geometry} />)

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('with geometry', async () => {
    const { unmount } = render(<View project={project} geometry={geometry} />)

    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1))

    unmount()
  })

  test('window pixelRatio', () => {
    window.devicePixelRatio = null
    const { unmount } = render(<View project={project} />)

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(<View project={project} />)
    window.dispatchEvent(new Event('resize'))

    unmount()
  })

  test('switches & buttons', async () => {
    const { unmount } = render(<View project={project} geometry={geometry} />)
    await waitFor(() => expect(mockGet).toHaveBeenCalledTimes(1))

    // Switches
    const switches = screen.getAllByRole('switch')
    switches.forEach((s) => fireEvent.click(s))

    // Buttons
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    await waitFor(() => expect(mockAvatarAdd).toHaveBeenCalledTimes(1))

    // Avatar error
    mockAvatarAdd.mockImplementation(() => {
      throw new Error()
    })
    const add = screen.getByRole('button', { name: 'fund-projection-screen' })
    fireEvent.click(add)
    await waitFor(() => expect(mockAvatarAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockError).toHaveBeenCalledTimes(1))

    // Zoom
    const zoomIn = screen.getByRole('button', { name: 'zoom-in' })
    fireEvent.mouseDown(zoomIn)
    fireEvent.mouseUp(zoomIn)

    const zoomOut = screen.getByRole('button', { name: 'zoom-out' })
    fireEvent.mouseDown(zoomOut)
    fireEvent.mouseUp(zoomOut)

    // Section view buttons
    const radios = screen.getAllByRole('radio')
    radios.forEach((radio) => fireEvent.click(radio))

    const hide = screen.getByRole('button', { name: 'eye-invisible' })
    fireEvent.click(hide)

    const snapX = screen.getByRole('button', { name: 'X' })
    fireEvent.click(snapX)

    const snapY = screen.getByRole('button', { name: 'Y' })
    fireEvent.click(snapY)

    const snapZ = screen.getByRole('button', { name: 'Z' })
    fireEvent.click(snapZ)

    const flip = screen.getByRole('button', { name: 'retweet' })
    fireEvent.click(flip)

    unmount()
  })

  // test('drawers', () => {
  //   act(() => {
  //     const event = {}
  //     wrapper.find('Drawer').forEach((drawer) => {
  //       if (drawer.props().onClose) drawer.props().onClose(event)
  //     })
  //   })
  // })
  // test('resize', () => {
  //   window.dispatchEvent(new Event('resize'))
  // })
  // test('pixelRatio', () => {
  //   wrapper.unmount()
  //   window.devicePixelRatio = undefined
  //   wrapper = mount(<View setPartSummary={jest.fn()} />)
  // })
  // test('grid visible', () => {
  //   wrapper.find('Switch').at(0).props().onChange(true)
  //   wrapper.find('Switch').at(0).props().onChange(false)
  // })
  // test('transparent', () => {
  //   wrapper.find('Switch').at(3).props().onChange(true)
  //   wrapper.find('Switch').at(3).props().onChange(false)
  // })
  // test('sectionView', () => {
  //   wrapper.unmount()
  //   mockState = true
  //   wrapper = mount(<View setPartSummary={jest.fn()} />)
  //   wrapper.find('Button').forEach((button) => {
  //     if (button.props().onClick) button.props().onClick()
  //   })
  // })
  // test('selection', () => {
  //   wrapper.find('Button').forEach((button) => {
  //     if (button.props().onClick) button.props().onClick()
  //   })
  //   mockSelectionEnabled.mockImplementation(() => true)
  //   wrapper.find('Button').forEach((button) => {
  //     if (button.props().onClick) button.props().onClick()
  //   })
  // })
  // test('handleTransform', () => {
  //   wrapper.unmount()
  //   mockState = true
  //   wrapper = mount(<View setPartSummary={jest.fn()} />)
  //   wrapper
  //     .find('.ant-radio-group')
  //     .parent()
  //     .props()
  //     .onChange({
  //       target: {
  //         value: 'value'
  //       }
  //     })
  // })
  // test('effect', () => {
  //   wrapper.unmount()
  //   const setPartSummary = jest.fn()
  //   mockGet.mockImplementation(() => {
  //     throw new Error()
  //   })
  //   wrapper = mount(
  //     <View
  //       simulation={{
  //         part: {}
  //       }}
  //       setPartSummary={setPartSummary}
  //     />
  //   )
  //   wrapper.unmount()
  //   mockGet.mockImplementation(() => ({ error: true }))
  //   wrapper = mount(
  //     <View
  //       simulation={{
  //         part: {}
  //       }}
  //       setPartSummary={setPartSummary}
  //     />
  //   )
  //   wrapper.unmount()
  //   mockGet.mockImplementation(() => ({}))
  //   wrapper = mount(
  //     <View
  //       simulation={{
  //         part: {}
  //       }}
  //       setPartSummary={setPartSummary}
  //     />
  //   )
  //   wrapper.unmount()
  //   mockGet.mockImplementation(() => ({
  //     solids: [
  //       {
  //         buffer:
  //           '{ "uuid": "uuid", "data": { "attributes": { "color": { "array": [0, 0, 1] } } } }'
  //       }
  //     ],
  //     faces: [
  //       {
  //         buffer:
  //           '{ "uuid": "uuid", "data": { "attributes": { "color": { "array": [0, 0, 1] } } } }'
  //       }
  //     ],
  //     edges: [
  //       {
  //         buffer:
  //           '{ "uuid": "uuid", "data": { "attributes": { "color": { "array": [0, 0, 1] } } } }'
  //       }
  //     ]
  //   }))
  //   wrapper = mount(
  //     <View
  //       simulation={{
  //         part: {}
  //       }}
  //       setPartSummary={setPartSummary}
  //     />
  //   )
  //   wrapper.unmount()
  //   wrapper = mount(
  //     <View
  //       simulation={{
  //         part: { needCleanup: true }
  //       }}
  //       setPartSummary={setPartSummary}
  //     />
  //   )
  //   wrapper.unmount()
  //   mockEnabled.mockImplementation(() => true)
  //   wrapper = mount(
  //     <View
  //       simulation={{
  //         part: {}
  //       }}
  //       setPartSummary={setPartSummary}
  //     />
  //   )
  // })
})
