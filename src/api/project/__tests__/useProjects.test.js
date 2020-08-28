import useProjects from '../useProjects'

let mockProjects = () => [{ id: 'id' }, {}]
jest.mock('swr', () => () => ({
  data: { projects: mockProjects() },
  mutate: jest.fn()
}))

describe('src/api/project/useProjects', () => {
  it('without ids', () => {
    const [
      projects,
      {
        mutateProjects,
        addOneProject,
        delOneProject,
        mutateOneProject,
        loadingProjects
      }
    ] = useProjects()
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

  it('with ids', () => {
    const [projects] = useProjects(['id1', 'id2'])
    expect(projects).toEqual([{ id: 'id' }, {}])
  })

  it('withtout projects', () => {
    mockProjects = () => {}
    const [projects] = useProjects(['id1', 'id2'])
    expect(projects).toEqual([])
  })
})
