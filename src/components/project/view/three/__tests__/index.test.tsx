import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import ThreeView, { errors } from '@/components/project/view/three'
import { SelectContext } from '@/context/select'
import { TGeometrySummary } from '@/database/geometry/get'

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn
  })
}))

jest.mock('antd', () => ({
  ...jest.requireActual('antd'),
  Spin: () => <div />
}))

jest.mock('uuid', () => ({
  v4: () => 'uuid'
}))

const mockErroNotification = jest.fn()
jest.mock('@/components/assets/notification', () => ({
  ErrorNotification: (title: string, err: Error) =>
    mockErroNotification(title, err)
}))

jest.mock('three/examples/jsm/controls/TrackballControls', () => ({
  TrackballControls: jest.fn().mockImplementation(() => ({
    target: {
      copy: jest.fn(),
      clone: () => ({
        sub: () => ({
          normalize: () => ({
            multiplyScalar: jest.fn()
          })
        })
      })
    },
    update: jest.fn(),
    object: {
      position: {
        distanceTo: jest.fn()
      }
    }
  }))
}))

const mockWebGLAvailable = jest.fn()
jest.mock('three/examples/jsm/capabilities/WebGL', () => ({
  isWebGLAvailable: () => mockWebGLAvailable()
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
    render: jest.fn(),
    dispose: jest.fn()
  })
}))

jest.mock('@/lib/three/helpers/PointHelper', () => ({
  PointHelper: () => ({
    build: jest.fn(),
    update: jest.fn(),
    dispose: jest.fn()
  })
}))

const mockPartLoader = jest.fn()
jest.mock('@/lib/three/loaders/PartLoader', () => {
  let count = 0
  return {
    PartLoader: (mouseMove: Function, mouseDown: Function) =>
      mockPartLoader(mouseMove, mouseDown, count++)
  }
})

const mockAvatarAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAvatarAdd()
}))

jest.mock('@/context/select/actions', () => ({
  highlight: jest.fn(),
  unhighlight: jest.fn(),
  select: jest.fn(),
  unselect: jest.fn(),
  setPart: jest.fn(),
  setPoint: jest.fn()
}))

let mockAnimationCount = 0
let mockZoomInCount = 0
let mockZoomOutCount = 0
Object.defineProperty(window, 'requestAnimationFrame', {
  value: (callback: Function) => {
    if (callback.name === 'animate') {
      mockAnimationCount++
      if (mockAnimationCount < 10) callback()
    } else if (callback.name === 'zoomInAnimationFrame') {
      mockZoomInCount++
      if (mockZoomInCount < 10) callback()
    } else if (callback.name === 'zoomOutAnimationFrame') {
      mockZoomOutCount++
      if (mockZoomOutCount < 10) callback()
    }
    return 1
  }
})

const contextValue0 = { enabled: false, selected: [], dispatch: jest.fn }

const contextValue1 = {
  enabled: false,
  selected: [],
  point: { x: 0, y: 1, z: 2 },
  dispatch: jest.fn
}

const contextValue2 = {
  enabled: true,
  selected: [{ uuid: 'uuid', label: 1 }],
  dispatch: jest.fn
}

describe('components/project/view/three', () => {
  const loading = false
  const project = {
    id: 'id',
    title: 'title'
  }
  const parts = [
    {
      summary: { uuid: 'uuid', type: 'result' } as TGeometrySummary,
      buffer: Buffer.from('buffer')
    }
  ]

  beforeEach(() => {
    mockErroNotification.mockReset()

    mockAvatarAdd.mockReset()

    mockWebGLAvailable.mockReset()
    mockWebGLAvailable.mockImplementation(() => true)

    mockPartLoader.mockImplementation((mouseMove, mouseDown, count) => {
      mouseMove({
        unhighlight: jest.fn()
      })
      mouseMove(
        {
          highlight: jest.fn()
        },
        'uuid'
      )
      mouseMove({}, undefined, undefined, { x: 0, y: 1, z: 2 })
      mouseDown(
        {
          getSelected: () => [{ uuid: 'uuid', label: 1 }],
          select: jest.fn(),
          unselect: jest.fn()
        },
        'uuid'
      )
      mouseDown(
        {
          getSelected: () => [{ uuid: 'uuid2', label: 2 }],
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
              ],
              userData: {
                lut: count === 1 ? null : {}
              }
            },
            {
              children: [
                {
                  userData: {},
                  material: {}
                }
              ]
            },
            { children: [{ userData: {}, material: {} }] }
          ]
        }),
        dispose: jest.fn()
      }
    })

    //@ts-ignore
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
        userData: {},
        dispose: jest.fn(),
        setTransparent: jest.fn(),
        setDisplayMesh: jest.fn(),
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
        userData: {},
        dispose: jest.fn(),
        setTransparent: jest.fn(),
        setDisplayMesh: jest.fn(),
        startSelection: jest.fn(),
        stopSelection: jest.fn(),
        getSelected: () => [{}],
        highlight: jest.fn(),
        select: jest.fn(),
        unselect: jest.fn()
      }
    ]
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue1}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('No WebGL', () => {
    mockWebGLAvailable.mockImplementation(() => false)
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('loading', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={true} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('without part', () => {
    //@ts-ignore
    global.MockScene.children = []
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={true} project={project} parts={[]} />
      </SelectContext.Provider>
    )

    const zoomToFit = screen.getByRole('button', { name: 'compress' })
    fireEvent.click(zoomToFit)

    unmount()
  })

  test('already loaded part', () => {
    //@ts-ignore
    global.MockScene.children = [
      {
        type: 'Part',
        uuid: 'uuid',
        userData: {},
        stopSelection: jest.fn(),
        dispose: jest.fn()
      }
    ]
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={true} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('window pixelRatio', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: null })
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )
    window.dispatchEvent(new Event('resize'))

    unmount()
  })

  test('switches & buttons', async () => {
    //@ts-ignore
    global.MockWebGLRenderer.toDataURL = () => ''
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    // Switches
    const switches = screen.getAllByRole('switch')
    switches.forEach((s) => fireEvent.click(s))

    // Buttons
    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => fireEvent.click(button))

    // Avatar
    const snapshot = screen.getByRole('button', {
      name: 'fund-projection-screen'
    })
    await act(() => fireEvent.mouseEnter(snapshot))
    await waitFor(() => screen.getByText('Project snapshot'))
    const projectSnapshot = screen.getByText('Project snapshot')
    await act(() => fireEvent.click(projectSnapshot))
    await waitFor(() => expect(mockAvatarAdd).toHaveBeenCalledTimes(1))

    // Avatar error
    mockAvatarAdd.mockImplementation(() => {
      throw new Error('avatar add error')
    })
    await act(() => fireEvent.click(projectSnapshot))
    await waitFor(() => expect(mockAvatarAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.snapshot,
        new Error('avatar add error')
      )
    )

    // Screnshot
    const exportImage = screen.getByText('Export image')
    await act(() => fireEvent.click(exportImage))

    // Screenshot error
    //@ts-ignore
    global.Date = jest.fn(() => {
      throw new Error('Date error')
    })
    await act(() => fireEvent.click(exportImage))
    await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.saveScreenshot,
        new Error('Date error')
      )
    )

    // Zoom
    const zoomIn = screen.getByRole('button', { name: 'zoom-in' })
    await act(() => fireEvent.mouseDown(zoomIn))
    await act(() => fireEvent.mouseUp(zoomIn))

    const zoomOut = screen.getByRole('button', { name: 'zoom-out' })
    await act(() => fireEvent.mouseDown(zoomOut))
    await act(() => fireEvent.mouseUp(zoomOut))

    // Section view buttons
    const hide = screen.getByRole('button', { name: 'eye-invisible' })
    await act(() => fireEvent.click(hide))

    const snapX = screen.getByRole('button', { name: 'X' })
    await act(() => fireEvent.click(snapX))

    const snapY = screen.getByRole('button', { name: 'Y' })
    await act(() => fireEvent.click(snapY))

    const snapZ = screen.getByRole('button', { name: 'Z' })
    await act(() => fireEvent.click(snapZ))

    const flip = screen.getByRole('button', { name: 'retweet' })
    await act(() => fireEvent.click(flip))

    unmount()
  }, 10_000)

  test('selection enabled', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue2}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('sectionView', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    // Activate
    const sectionView = screen.getByRole('button', { name: 'scissor' })
    fireEvent.click(sectionView)

    const stop = screen.getByRole('button', { name: 'stop' })
    fireEvent.click(stop)

    unmount()
  })

  test('selectionHelper', () => {
    mockSelectionEnabled.mockImplementation(() => true)
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    const selection = screen.getByRole('button', { name: 'select' })
    fireEvent.click(selection)

    unmount()
  })

  test('dimension 2', () => {
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView
          loading={loading}
          project={project}
          parts={[
            {
              ...parts[0],
              summary: { uuid: 'uuid', type: 'geometry2D', dimension: 2 }
            }
          ]}
        />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('load & load', () => {
    const { rerender, unmount } = render(
      <SelectContext.Provider value={contextValue1}>
        <ThreeView loading={loading} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    rerender(
      <SelectContext.Provider value={contextValue1}>
        <ThreeView
          loading={loading}
          project={project}
          parts={[
            {
              summary: { uuid: 'uuid1' } as TGeometrySummary,
              buffer: Buffer.from('buffer')
            }
          ]}
        />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('load error', async () => {
    //@ts-ignore
    global.MockScene.children = []
    mockPartLoader.mockImplementation(() => {
      throw new Error('load error')
    })
    const { unmount } = render(
      <SelectContext.Provider value={contextValue0}>
        <ThreeView loading={true} project={project} parts={parts} />
      </SelectContext.Provider>
    )

    await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(1))
    await waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.load,
        new Error('load error')
      )
    )

    unmount()
  }, 10_000)
})
