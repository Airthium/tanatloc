import { useProjects } from '../useProjects'

const mockProjects = jest.fn()
jest.mock('swr', () => () => ({
  data: { projects: mockProjects() },
  mutate: jest.fn()
}))

describe('api/project/useProjects', () => {
  test('without ids', () => {
    mockProjects.mockImplementation(() => [{ id: 'id' }, {}])
    const [
      projects,
      {
        mutateProjects,
        addOneProject,
        delOneProject,
        mutateOneProject,
        loadingProjects
      }
    ] =
      //@ts-ignore
      useProjects()
    expect(projects).toEqual([{ id: 'id' }, {}])
    expect(mutateProjects).toBeDefined()
    expect(addOneProject).toBeDefined()
    expect(delOneProject).toBeDefined()
    expect(mutateOneProject).toBeDefined()
    expect(loadingProjects).toBe(false)

    addOneProject({ id: 'id' })
    delOneProject({ id: 'id' })
    mutateOneProject({ id: 'id' })
  })

  test('with ids', () => {
    mockProjects.mockImplementation(() => [{ id: 'id' }, {}])
    const [projects] = useProjects(['id1', 'id2'])
    expect(projects).toEqual([{ id: 'id' }, {}])
  })

  test('withtout projects', () => {
    mockProjects.mockImplementation(() => {})
    const [projects] = useProjects(['id1', 'id2'])
    expect(projects).toEqual([])
  })
})
