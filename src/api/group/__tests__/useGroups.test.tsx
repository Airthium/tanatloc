import { render } from '@testing-library/react'

import { useGroups } from '../useGroups'

const mockGroups = jest.fn()
jest.mock('swr', () => () => ({
  data: { groups: mockGroups() },
  mutate: jest.fn()
}))

let data: any
const FunctionalComponent = ({ id }: { id?: string }) => {
  const [groups, { addOneGroup, mutateOneGroup, delOneGroup, loadingGroups }] =
    useGroups(id)

  data = {
    groups,
    swr: { addOneGroup, mutateOneGroup, delOneGroup, loadingGroups }
  }

  return null
}

describe('api/groups', () => {
  beforeEach(() => {
    data = null
  })

  test('with groups', () => {
    mockGroups.mockImplementation(() => [{ id: 'id' }, { id: 'id1' }])

    render(<FunctionalComponent />)

    expect(data.groups).toEqual([{ id: 'id' }, { id: 'id1' }])
    expect(data.swr.addOneGroup).toBeDefined()
    data.swr.addOneGroup({
      id: 'id',
      name: 'name',
      users: ['id'],
      organization: 'id'
    })
    expect(data.swr.mutateOneGroup).toBeDefined()
    data.swr.mutateOneGroup({ id: 'id' })
    data.swr.mutateOneGroup({ id: 'id' })
    expect(data.swr.delOneGroup).toBeDefined()
    data.swr.delOneGroup({ id: 'id' })
    data.swr.delOneGroup({ id: 'id' })
    expect(data.swr.loadingGroups).toBe(false)
  })

  test('without groups', () => {
    mockGroups.mockImplementation(() => {
      // empty
    })

    render(<FunctionalComponent />)

    expect(data.groups).toEqual([])
  })

  test('with id', () => {
    mockGroups.mockImplementation(() => [{ id: 'id' }])

    render(<FunctionalComponent id="id" />)

    expect(data.groups).toEqual([{ id: 'id' }])
  })
})
