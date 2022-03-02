import { useWorkspaces } from '../useWorkspaces'

const mockWorkspaces = jest.fn()
jest.mock('swr', () => () => ({
  data: { workspaces: mockWorkspaces() },
  mutate: jest.fn()
}))

describe('api/workspace/useWorkspaces', () => {
  test('call', () => {
    mockWorkspaces.mockImplementation(() => [{ id: 'id' }, {}])
    const [
      workspaces,
      {
        mutateWorkspaces,
        addOneWorkspace,
        delOneWorkspace,
        mutateOneWorkspace,
        loadingWorkspaces
      }
    ] = useWorkspaces()
    expect(workspaces).toEqual([{ id: 'id' }, {}])
    expect(mutateWorkspaces).toBeDefined()
    expect(addOneWorkspace).toBeDefined()
    expect(delOneWorkspace).toBeDefined()
    expect(mutateOneWorkspace).toBeDefined()
    expect(loadingWorkspaces).toBe(false)

    addOneWorkspace({ id: 'id', name: 'name', owners: ['id'] })
    delOneWorkspace({ id: 'id' })
    mutateOneWorkspace({ id: 'id' })
  })

  test('without workspace', () => {
    mockWorkspaces.mockImplementation(() => {})
    const [workspaces] = useWorkspaces()
    expect(workspaces).toEqual([])
  })
})
