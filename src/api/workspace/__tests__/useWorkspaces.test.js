import useWorkspaces from '../useWorkspaces'

const mockWorkspaces = jest.fn()
jest.mock('swr', () => () => ({
  data: { workspaces: mockWorkspaces() },
  mutate: jest.fn()
}))

describe('src/api/workspace/useWorkspaces', () => {
  it('call', () => {
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

    addOneWorkspace({ id: 'id' })
    delOneWorkspace({ id: 'id' })
    mutateOneWorkspace({ id: 'id' })
  })

  it('without workspace', () => {
    mockWorkspaces.mockImplementation(() => {})
    const [workspaces] = useWorkspaces()
    expect(workspaces).toEqual([])
  })
})
