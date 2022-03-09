import { render } from '@testing-library/react'

import { useProject } from '../useProject'

const mockProject = jest.fn()
jest.mock('swr', () => () => ({
  data: { project: mockProject() },
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = ({ id }: { id?: string }) => {
  const [project, { mutateProject, loadingProject }] = useProject(id)

  data = {
    project,
    swr: { mutateProject, loadingProject }
  }

  return null
}

describe('api/project/useProject', () => {
  test('with project', () => {
    mockProject.mockImplementation(() => ({}))

    render(<FunctionalComponent />)

    expect(data.project).toEqual({})
    expect(data.swr.mutateProject).toBeDefined()
    expect(data.swr.loadingProject).toBe(false)

    data.swr.mutateProject({ id: 'id' })
  })

  test('without project', () => {
    mockProject.mockImplementation(jest.fn())

    render(<FunctionalComponent />)

    expect(data.project).toEqual({ id: '0' })
    expect(data.swr.mutateProject).toBeDefined()
    expect(data.swr.loadingProject).toBe(false)
  })

  test('with id', () => {
    mockProject.mockImplementation(jest.fn())

    render(<FunctionalComponent id="id" />)

    expect(data.project).toEqual({ id: '0' })
    expect(data.swr.mutateProject).toBeDefined()
    expect(data.swr.loadingProject).toBe(false)
  })
})
