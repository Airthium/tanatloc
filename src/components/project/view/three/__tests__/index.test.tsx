import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import ThreeView, { errors } from '@/components/project/view/three'
import { SelectContext } from '@/context/select'

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

jest.mock('three/examples/jsm/postprocessing/RenderPass', () => ({
  RenderPass: class MockRenderPass {}
}))

jest.mock('three/examples/jsm/postprocessing/OutlinePass', () => ({
  OutlinePass: jest.fn().mockImplementation(() => ({
    visibleEdgeColor: {
      set: jest.fn()
    },
    hiddenEdgeColor: {
      set: jest.fn()
    }
  }))
}))

jest.mock('three/examples/jsm/postprocessing/EffectComposer', () => ({
  EffectComposer: jest.fn().mockImplementation(() => ({
    addPass: jest.fn(),
    render: jest.fn()
  }))
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

const mockPartLoader = jest.fn()
jest.mock('@/lib/three/loaders/PartLoader', () => {
  let count = 0
  return {
    PartLoader: (mouseMove, mouseDown) =>
      mockPartLoader(mouseMove, mouseDown, count++)
  }
})

const mockAvatarAdd = jest.fn()
jest.mock('@/api/avatar', () => ({
  add: async () => mockAvatarAdd()
}))

jest.mock('@/context/select/actions', () => ({
  highlight: jest.fn(),
  select: jest.fn(),
  unselect: jest.fn()
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
  }
})

describe('components/project/view/three', () => {
  const loading = false
  const project = {
    id: 'id',
    title: 'title'
  }
  const part = {
    uuid: 'uuid',
    buffer: Buffer.from('buffer')
  }

  beforeEach(() => {
    mockErroNotification.mockReset()

    mockAvatarAdd.mockReset()

    mockPartLoader.mockImplementation((mouseMove, mouseDown, count) => {
      mouseMove(
        {
          highlight: jest.fn()
        },
        'uuid'
      )
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
              ]
            },
            {
              children: [
                {
                  userData: {
                    lut: count === 1 ? null : {}
                  },
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
  })

  test('render', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={loading} project={project} part={part} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('loading', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={true} project={project} part={part} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('without part', () => {
    global.MockScene.children = []
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={true} project={project} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('already loaded part', () => {
    global.MockScene.children = [
      {
        type: 'Part',
        uuid: 'uuid'
      }
    ]
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={true} project={project} part={part} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('loaded', async () => {
    mockPartLoader.mockImplementation(() => {
      throw new Error('load error')
    })
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={true} project={project} part={part} />
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
  })

  test('window pixelRatio', () => {
    Object.defineProperty(window, 'devicePixelRatio', { value: null })
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={loading} project={project} part={part} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('resize', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={loading} project={project} part={part} />
      </SelectContext.Provider>
    )
    window.dispatchEvent(new Event('resize'))

    unmount()
  })

  test('switches & buttons', async () => {
    global.MockWebGLRenderer.toDataURL = () => ''
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={loading} project={project} part={part} />
      </SelectContext.Provider>
    )

    // Wait scene loading
    await new Promise((resolve) => setTimeout(resolve, 100))

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
    fireEvent.mouseEnter(snapshot)
    await waitFor(() => screen.getByText('Project snapshot'))
    const projectSnapshot = screen.getByText('Project snapshot')
    fireEvent.click(projectSnapshot)
    await waitFor(() => expect(mockAvatarAdd).toHaveBeenCalledTimes(1))

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Avatar error
    mockAvatarAdd.mockImplementation(() => {
      throw new Error('avatar add error')
    })
    fireEvent.click(projectSnapshot)
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
    fireEvent.click(exportImage)

    await new Promise((resolve) => setTimeout(resolve, 100))

    // Screenshot error
    //@ts-ignore
    global.Date = jest.fn(() => {
      throw new Error('Date error')
    })
    fireEvent.click(exportImage)
    await waitFor(() => expect(mockErroNotification).toHaveBeenCalledTimes(2))
    await waitFor(() =>
      expect(mockErroNotification).toHaveBeenLastCalledWith(
        errors.saveScreenshot,
        new Error('Date error')
      )
    )

    // Zoom
    const zoomIn = screen.getByRole('button', { name: 'zoom-in' })
    fireEvent.mouseDown(zoomIn)
    fireEvent.mouseUp(zoomIn)

    const zoomOut = screen.getByRole('button', { name: 'zoom-out' })
    fireEvent.mouseDown(zoomOut)
    fireEvent.mouseUp(zoomOut)

    // Section view buttons
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

  test('selection enabled', async () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{
          enabled: true,
          selected: [{ uuid: 'uuid', label: 1 }],
          dispatch: jest.fn
        }}
      >
        <ThreeView loading={loading} project={project} part={part} />
      </SelectContext.Provider>
    )

    unmount()
  })

  test('sectionView', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={loading} project={project} part={part} />
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
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView loading={loading} project={project} part={part} />
      </SelectContext.Provider>
    )

    const selection = screen.getByRole('button', { name: 'select' })
    fireEvent.click(selection)

    unmount()
  })

  test('dimension 2', () => {
    const { unmount } = render(
      <SelectContext.Provider
        value={{ enabled: false, selected: [], dispatch: jest.fn }}
      >
        <ThreeView
          loading={loading}
          project={project}
          part={{ ...part, dimension: 2 }}
        />
      </SelectContext.Provider>
    )

    unmount()
  })
})
