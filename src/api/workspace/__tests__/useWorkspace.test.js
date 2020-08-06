import useWorkspace from '../useWorkspace'

jest.mock('swr', () => () => ({ data: { workspaces: {} }, mutate: jest.fn() }))

describe('src/api/workspace', () => {
  it('useWorkspace', () => {
    const [workspaces, { mutate, loading }] = useWorkspace()
    expect(workspaces).toEqual({})
    expect(mutate).toBeDefined()
    expect(loading).toBe(false)
  })
})
