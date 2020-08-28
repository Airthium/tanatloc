import useProjects from '../useProjects'

let mockProjects = () => []
jest.mock('swr', () => () => ({
  data: { projects: mockProjects() },
  mutate: jest.fn()
}))

describe('src/api/project/useProjects', () => {
  it('without ids', () => {
    const [projects, { mutateProjects, loadingProjects }] = useProjects()
    expect(projects).toEqual([])
    expect(mutateProjects).toBeDefined()
    expect(loadingProjects).toBe(false)
  })

  it('with ids', () => {
    const [projects, { mutateProjects, loadingProjects }] = useProjects([
      'id1',
      'id2'
    ])
    expect(projects).toEqual([])
    expect(mutateProjects).toBeDefined()
    expect(loadingProjects).toBe(false)
  })

  it('withtout projects', () => {
    mockProjects = () => {}
    const [projects, { mutateProjects, loadingProjects }] = useProjects([
      'id1',
      'id2'
    ])
    expect(projects).toEqual([])
    expect(mutateProjects).toBeDefined()
    expect(loadingProjects).toBe(false)
  })
})
