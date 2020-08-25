import useProject from '../useProject'

jest.mock('swr', () => () => ({ data: { project: {} }, mutate: jest.fn() }))

describe('src/api/project', () => {
  it('useProject', () => {
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })
})
