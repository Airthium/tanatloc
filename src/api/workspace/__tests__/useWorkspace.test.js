import useWorkspace from '../useWorkspace'

jest.mock('swr', () => () => ({
  data: { workspaces: {} },
  mutate: jest.fn()
}))

describe('src/api/workspace', () => {
  it('useWorkspace', () => {
    const [workspaces, { mutateWorkspace, loadingWorkspace }] = useWorkspace()
    expect(workspaces).toEqual({})
    expect(mutateWorkspace).toBeDefined()
    expect(loadingWorkspace).toBe(false)
  })
})
