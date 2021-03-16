import useProject from '../useProject'

const mockProject = jest.fn()
jest.mock('swr', () => () => ({
  data: { project: mockProject() },
  mutate: jest.fn()
}))

describe('api/project/useProject', () => {
  it('with project', () => {
    mockProject.mockImplementation(() => ({}))
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })

  it('without project', () => {
    mockProject.mockImplementation(() => {})
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })

  it('with id', () => {
    mockProject.mockImplementation(() => {})
    const [project, { mutateProject, loadingProject }] = useProject('id')
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })
})
