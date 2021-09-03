import React from 'react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { reducer } from '@/store/store'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MathJaxContext } from 'better-react-mathjax'

import Project from '@/pages/project'

// Next/router mock
const mockRouterPush = jest.fn()
const mockRouterReplace = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: jest.fn(),
    push: (route) => mockRouterPush(route),
    replace: (route) => mockRouterReplace(route),
    query: mockQuery()
  })
}))

// SWR mock
const mockSWR = jest.fn()
jest.mock('swr', () => () => mockSWR())

// Fetch mock
const mockFetch = jest.fn()
global.fetch = (route, params) => mockFetch(route, params)

// Sentry mock
const mockCaptureException = jest.fn()
jest.mock('@sentry/node', () => ({
  init: jest.fn,
  captureException: (err) => mockCaptureException(err)
}))

// Three mock
jest.mock('three/examples/jsm/controls/TrackballControls', () => ({
  TrackballControls: class {
    constructor() {}
  }
}))

jest.mock('three/examples/jsm/postprocessing/RenderPass', () => ({
  RenderPass: class {
    constructor() {}
  }
}))

jest.mock('three/examples/jsm/postprocessing/OutlinePass', () => ({
  OutlinePass: class {
    constructor() {
      return {
        hiddenEdgeColor: {
          set: jest.fn
        },
        visibleEdgeColor: {
          set: jest.fn
        }
      }
    }
  }
}))

jest.mock('three/examples/jsm/postprocessing/EffectComposer', () => ({
  EffectComposer: class {
    constructor() {
      return {
        addPass: jest.fn
      }
    }
  }
}))

jest.mock('three/examples/jsm/controls/TransformControls', () => ({
  TransformControls: class {
    constructor() {}
  }
}))

jest.mock('three/examples/jsm/loaders/GLTFLoader', () => ({
  GLTFLoader: class {
    constructor() {}
  }
}))

jest.mock('three/examples/jsm/loaders/DRACOLoader', () => ({
  DRACOLoader: class {
    constructor() {}
  }
}))

describe('e2e/frontend/project', () => {
  const store = configureStore({ reducer })

  beforeEach(() => {
    mockRouterPush.mockReset()
    mockRouterReplace.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({
      page: 'page',
      workspaceId: 'workspaceId',
      projectId: 'projectId'
    }))

    mockSWR.mockReset()
    mockSWR.mockImplementation(() => ({
      data: {
        user: { authorizedplugins: [] },
        project: { id: 'id', geometries: [] },
        simulations: null,
        geometries: null
      },
      error: null,
      mutate: jest.fn
    }))

    mockFetch.mockReset()

    mockCaptureException.mockReset()
  })

  test('render', () => {
    const { unmount } = render(
      <Provider store={store}>
        <MathJaxContext>
          <Project />
        </MathJaxContext>
      </Provider>
    )

    unmount()
  })

  test('render, without user', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: null,
        project: null,
        simulations: null,
        geometries: null
      },
      error: null,
      mutate: jest.fn
    }))

    const { unmount } = render(
      <Provider store={store}>
        <MathJaxContext>
          <Project />
        </MathJaxContext>
      </Provider>
    )

    expect(mockRouterReplace).toHaveBeenLastCalledWith('/login')

    unmount()
  })

  test('user, project, simulations & geometries error', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: { authorizedplugins: [] },
        project: null,
        simulations: null,
        geometries: null
      },
      error: new Error('SWR error'),
      mutate: jest.fn
    }))

    const { unmount } = render(
      <Provider store={store}>
        <MathJaxContext>
          <Project />
        </MathJaxContext>
      </Provider>
    )

    expect(mockCaptureException).toHaveBeenCalledTimes(4)

    unmount()
  })

  test('dashboard', () => {
    const { unmount } = render(
      <Provider store={store}>
        <MathJaxContext>
          <Project />
        </MathJaxContext>
      </Provider>
    )

    const dashboard = screen.getByRole('button', {
      name: 'arrow-left Return to dashboard'
    })
    fireEvent.click(dashboard)

    expect(mockRouterPush).toHaveBeenLastCalledWith({
      pathname: '/dashboard',
      query: { page: 'page', workspaceId: 'workspaceId' }
    })

    unmount()
  })

  test('add geometry', () => {
    const { unmount } = render(
      <Provider store={store}>
        <MathJaxContext>
          <Project />
        </MathJaxContext>
      </Provider>
    )

    // Open geometries
    const geometries = screen.getByRole('menuitem', { name: 'Geometries (0)' })
    fireEvent.click(geometries)

    const add = screen.getByRole('button', { name: 'plus New Geometry' })
    fireEvent.click(add)

    // TODO continue here

    unmount()
  })

  test('add simulation', () => {
    mockSWR.mockImplementation(() => ({
      data: {
        user: { authorizedplugins: [] },
        project: { id: 'id', geometries: [] },
        simulations: null,
        geometries: [{}]
      },
      error: null,
      mutate: jest.fn
    }))
    const { unmount } = render(
      <Provider store={store}>
        <MathJaxContext>
          <Project />
        </MathJaxContext>
      </Provider>
    )

    // Open simulations
    const simulations = screen.getByRole('menuitem', {
      name: 'calculator Simulations (0)'
    })
    fireEvent.click(simulations)

    const add = screen.getByRole('button', { name: 'plus New Simulation' })
    fireEvent.click(add)

    // TODO continue here

    unmount()
  })
})
