import useWorkspaces from '../useWorkspaces'

jest.mock('swr', () => () => ({
  data: { workspaces: {} },
  mutate: jest.fn()
}))

describe('src/api/workspace', () => {
  it('useWorkspaces', () => {
    const [
      workspaces,
      { mutateWorkspaces, loadingWorkspaces }
    ] = useWorkspaces()
    expect(workspaces).toEqual({})
    expect(mutateWorkspaces).toBeDefined()
    expect(loadingWorkspaces).toBe(false)
  })
})
