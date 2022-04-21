import { render } from '@testing-library/react'

import { useWorkspaces } from '../useWorkspaces'

const mockWorkspaces = jest.fn()
jest.mock('swr', () => () => ({
  data: { workspaces: mockWorkspaces() },
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = () => {
  const [
    workspaces,
    {
      mutateWorkspaces,
      addOneWorkspace,
      delOneWorkspace,
      mutateOneWorkspace,
      loadingWorkspaces
    }
  ] = useWorkspaces()

  data = {
    workspaces,
    swr: {
      mutateWorkspaces,
      addOneWorkspace,
      delOneWorkspace,
      mutateOneWorkspace,
      loadingWorkspaces
    }
  }

  return null
}

describe('api/workspace/useWorkspaces', () => {
  test('call', () => {
    mockWorkspaces.mockImplementation(() => [{ id: 'id' }, {}])

    render(<FunctionalComponent />)

    expect(data.workspaces).toEqual([{ id: 'id' }, {}])
    expect(data.swr.mutateWorkspaces).toBeDefined()
    expect(data.swr.addOneWorkspace).toBeDefined()
    expect(data.swr.delOneWorkspace).toBeDefined()
    expect(data.swr.mutateOneWorkspace).toBeDefined()
    expect(data.swr.loadingWorkspaces).toBe(false)

    data.swr.addOneWorkspace({ id: 'id', name: 'name', owners: ['id'] })
    data.swr.delOneWorkspace({ id: 'id' })
    data.swr.mutateOneWorkspace({ id: 'id' })
  })

  test('without workspace', () => {
    mockWorkspaces.mockImplementation(() => undefined)

    render(<FunctionalComponent />)

    expect(data.workspaces).toEqual([])
  })
})
