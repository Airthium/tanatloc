import { render } from '@testing-library/react'

import { useProjects } from '../useProjects'

jest.mock('@/api/call', () => ({
  fetcher: jest.fn
}))

const mockProjects = jest.fn()
jest.mock('swr', () => (_route: string, payload?: Function) => {
  payload?.(['url', 'payload'])
  return {
    data: { projects: mockProjects() },
    mutate: jest.fn()
  }
})

let data: any
const FunctionalComponent = ({ ids }: { ids?: string[] }) => {
  const [
    projects,
    { addOneProject, delOneProject, mutateOneProject, loadingProjects }
  ] = useProjects(ids)

  data = {
    projects,
    swr: {
      addOneProject,
      delOneProject,
      mutateOneProject,
      loadingProjects
    }
  }

  return null
}

describe('api/project/useProjects', () => {
  test('without ids', () => {
    mockProjects.mockImplementation(() => [{ id: 'id' }, {}])

    render(<FunctionalComponent />)

    expect(data.projects).toEqual([{ id: 'id' }, {}])
    expect(data.swr.addOneProject).toBeDefined()
    expect(data.swr.delOneProject).toBeDefined()
    expect(data.swr.mutateOneProject).toBeDefined()
    expect(data.swr.loadingProjects).toBe(false)

    data.swr.addOneProject({
      id: 'id',
      title: 'title',
      owners: ['id'],
      workspace: 'id'
    })
    data.swr.delOneProject({ id: 'id' })
    data.swr.mutateOneProject({ id: 'id' })
  })

  test('with ids', () => {
    mockProjects.mockImplementation(() => [{ id: 'id' }, {}])

    render(<FunctionalComponent ids={['id1', 'id2']} />)

    expect(data.projects).toEqual([{ id: 'id' }, {}])
  })

  test('withtout projects', () => {
    mockProjects.mockImplementation(() => undefined)

    render(<FunctionalComponent ids={['id1', 'id2']} />)

    expect(data.projects).toEqual([])
  })
})
