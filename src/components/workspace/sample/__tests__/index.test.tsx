import SampleWorkspace from '..'

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockRouter
  })
}))

jest.mock('@sentry/nextjs', () => ({ init: jest.fn }))

jest.mock('@/models', () => [
  {
    algorithm: 'poisson',
    configuration: {
      geometry: { children: [{}] },
      parameters: {},
      boundaryConditions: { dirichlet: {} },
      run: {}
    }
  }
])

const mockAddError = jest.fn()
jest.mock('@/context/notification/actions', () => ({
  addError: (props: any) => mockAddError(props)
}))

const mockDialog = jest.fn()
jest.mock('@/components/assets/dialog', () => (props: any) => mockDialog(props))

const mockWorkspaceAdd = jest.fn()
jest.mock('@/api/workspace', () => ({
  add: async () => mockWorkspaceAdd()
}))

const mockProjectAdd = jest.fn()
jest.mock('@/api/project', () => ({
  add: async () => mockProjectAdd()
}))

const mockGeometryAdd = jest.fn()
jest.mock('@/api/geometry', () => ({
  add: async () => mockGeometryAdd()
}))

const mockSimulationAdd = jest.fn()
jest.mock('@/api/simulation', () => ({
  add: async () => mockSimulationAdd()
}))

const mockFetch = jest.fn()
Object.defineProperty(global, 'fetch', { value: mockFetch })

describe('components/workspace/sample', () => {
  const visible = true
  const setVisible = jest.fn
  const user = { id: 'id', plugins: [{ key: 'local' }] }
  const addOneWorkspace = jest.fn()
  const swr = {
    addOneWorkspace
  }

  beforeEach(() => {
    mockRouter.mockReset()

    mockDialog.mockReset()
    mockDialog.mockImplementation(() => <div />)

    mockWorkspaceAdd.mockReset()
    mockProjectAdd.mockReset()
    mockGeometryAdd.mockReset()
    mockSimulationAdd.mockReset()

    mockFetch.mockReset()
    mockFetch.mockImplementation(() => ({
      blob: async () => new Blob()
    }))
  })

  test('render', () => {
    const { unmount } = render(
      <SampleWorkspace
        visible={visible}
        setVisible={setVisible}
        user={user}
        swr={swr}
      />
    )

    unmount()
  })

  test('onOk', async () => {
    mockWorkspaceAdd.mockImplementation(() => ({}))
    mockProjectAdd.mockImplementation(() => ({}))
    mockGeometryAdd.mockImplementation(() => ({
      summary: {
        faces: [
          { label: 2, uuid: '1' },
          { label: '4', uuid: '2' }
        ]
      }
    }))
    mockSimulationAdd.mockImplementation(() => ({}))
    mockDialog.mockImplementation((props: any) => (
      <div
        role="Dialog"
        onClick={async () => {
          try {
            await props.onOk()
          } catch (_err) {}
        }}
      >
        {props.children}
      </div>
    ))
    const { unmount } = render(
      <SampleWorkspace
        visible={visible}
        setVisible={setVisible}
        user={user}
        swr={swr}
      />
    )

    const dialog = screen.getByRole('Dialog')
    act(() => fireEvent.click(dialog))

    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockProjectAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockGeometryAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockRouter).toHaveBeenCalledTimes(1))

    // Simulation error
    mockSimulationAdd.mockImplementation(() => {
      throw new Error('simulation add error')
    })
    act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockProjectAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockGeometryAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockRouter).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockAddError).toHaveBeenCalledTimes(1))

    // Geometry error
    mockGeometryAdd.mockImplementation(() => {
      throw new Error('geometry add error')
    })
    act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockProjectAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockGeometryAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockRouter).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockAddError).toHaveBeenCalledTimes(2))

    // Project error
    mockProjectAdd.mockImplementation(() => {
      throw new Error('project add error')
    })
    act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(4))
    await waitFor(() => expect(mockProjectAdd).toHaveBeenCalledTimes(4))
    await waitFor(() => expect(mockGeometryAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockRouter).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockAddError).toHaveBeenCalledTimes(3))

    // Workspace error
    mockWorkspaceAdd.mockImplementation(() => {
      throw new Error('workspace add error')
    })
    act(() => fireEvent.click(dialog))
    await waitFor(() => expect(mockWorkspaceAdd).toHaveBeenCalledTimes(5))
    await waitFor(() => expect(mockProjectAdd).toHaveBeenCalledTimes(4))
    await waitFor(() => expect(mockGeometryAdd).toHaveBeenCalledTimes(3))
    await waitFor(() => expect(mockSimulationAdd).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(swr.addOneWorkspace).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockRouter).toHaveBeenCalledTimes(1))
    await waitFor(() => expect(mockAddError).toHaveBeenCalledTimes(4))

    unmount()
  })
})
