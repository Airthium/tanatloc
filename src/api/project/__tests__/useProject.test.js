import useProject from '../useProject'

let mockProject
jest.mock('swr', () => () => ({
  data: { project: mockProject() },
  mutate: jest.fn()
}))

describe('src/api/project/useProject', () => {
  it('with project', () => {
    mockProject = () => ({})
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })

  it('with project', () => {
    mockProject = () => {}
    const [project, { mutateProject, loadingProject }] = useProject()
    expect(project).toEqual({})
    expect(mutateProject).toBeDefined()
    expect(loadingProject).toBe(false)
  })
})
