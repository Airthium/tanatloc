import { useGroups } from '../useGroups'

const mockGroups = jest.fn()
jest.mock('swr', () => () => ({
  data: { groups: mockGroups() },
  mutate: jest.fn()
}))

describe('api/groups', () => {
  test('with groups', () => {
    mockGroups.mockImplementation(() => [{ id: 'id' }, { id: 'id1' }])
    const [
      groups,
      { addOneGroup, mutateOneGroup, delOneGroup, loadingGroups }
    ] = useGroups()
    expect(groups).toEqual([{ id: 'id' }, { id: 'id1' }])
    expect(addOneGroup).toBeDefined()
    addOneGroup({ id: 'id' })
    expect(mutateOneGroup).toBeDefined()
    mutateOneGroup({ id: 'id' })
    mutateOneGroup({ id: 'id' })
    expect(delOneGroup).toBeDefined()
    delOneGroup({ id: 'id' })
    delOneGroup({ id: 'id' })
    expect(loadingGroups).toBe(false)
  })

  test('without groups', () => {
    mockGroups.mockImplementation(() => {
      // empty
    })
    const [groups] = useGroups()
    expect(groups).toEqual([])
  })

  test('with id', () => {
    mockGroups.mockImplementation(() => [{ id: 'id' }])
    const [groups] = useGroups('id')
    expect(groups).toEqual([{ id: 'id' }])
  })
})
