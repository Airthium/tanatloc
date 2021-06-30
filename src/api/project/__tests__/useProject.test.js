import useProject from '../useProject'

const mockProject = jest.fn()
jest.mock('swr', () => () => ({
  data: { project: mockProject() },
  mutate: jest.fn()
}))

describe('api/project/useProject', () => {
  test('with project', () => {
    mockProject.mockImplementation(() => ({}))
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)

    mutateProject({})
  })

  test('without project', () => {
    mockProject.mockImplementation(jest.fn())
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })

  test('with id', () => {
    mockProject.mockImplementation(jest.fn())
    const [project, { mutateProject, loadingProject }] = useProject('id')
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })
})
