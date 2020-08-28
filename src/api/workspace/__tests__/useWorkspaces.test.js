import useWorkspaces from '../useWorkspaces'

let mockWorkspaces = () => []
jest.mock('swr', () => () => ({
  data: { workspaces: mockWorkspaces() },
  mutate: jest.fn()
}))

describe('src/api/workspace/useWorkspaces', () => {
  it('call', () => {
    const [
      workspaces,
      { mutateWorkspaces, loadingWorkspaces }
    ] = useWorkspaces()
    expect(workspaces).toEqual([])
    expect(mutateWorkspaces).toBeDefined()
    expect(loadingWorkspaces).toBe(false)
  })

  it('without workspace', () => {
    mockWorkspaces = () => {}
    const [
      workspaces,
      { mutateWorkspaces, loadingWorkspaces }
    ] = useWorkspaces()
    expect(workspaces).toEqual([])
    expect(mutateWorkspaces).toBeDefined()
    expect(loadingWorkspaces).toBe(false)
  })
})
