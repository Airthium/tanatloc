import useGroups from '../useGroups'

const mockGroups = jest.fn()
jest.mock('swr', () => () => ({
  data: { groups: mockGroups() },
  mutate: jest.fn()
}))

describe('api/groups', () => {
  test('with groups', () => {
    mockGroups.mockImplementation(() => [{ id: 'id' }])
    const [
      groups,
      { addOneGroup, mutateOneGroup, delOneGroup, loadingGroups }
    ] = useGroups()
    expect(groups).toEqual([{ id: 'id' }])
    expect(addOneGroup).toBeDefined()
    addOneGroup({})
    expect(mutateOneGroup).toBeDefined()
    mutateOneGroup({})
    mutateOneGroup({ id: 'id' })
    expect(delOneGroup).toBeDefined()
    delOneGroup({})
    delOneGroup({ id: 'id' })
    expect(loadingGroups).toBe(false)
  })

  test('without groups', () => {
    mockGroups.mockImplementation(() => {})
    const [groups] = useGroups()
    expect(groups).toEqual([])
  })

  test('with id', () => {
    mockGroups.mockImplementation(() => [{ id: 'id' }])
    const [groups] = useGroups('id')
    expect(groups).toEqual([{ id: 'id' }])
  })
})
