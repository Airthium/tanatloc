import useProject from '../useProject'

const mockProject = jest.fn()
jest.mock('swr', () => () => ({
  data: { project: mockProject() },
  mutate: jest.fn()
}))

describe('api/project/useProject', () => {
  test('with project', () => {
    mockProject.mockImplementation(() => ({}))
    const [project, { reloadProject, mutateProject, loadingProject }] =
      useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
    expect(reloadProject).toBeDefined()
    reloadProject()
  })

  test('without project', () => {
    mockProject.mockImplementation(() => {})
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })

  test('with id', () => {
    mockProject.mockImplementation(() => {})
    const [project, { mutateProject, loadingProject }] = useProject('id')
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })
})
