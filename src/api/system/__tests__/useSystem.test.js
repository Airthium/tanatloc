import useSystem from '../useSystem'

jest.mock('swr', () => () => ({
  data: { system: { item: 'item' } },
  mutate: jest.fn()
}))

describe('api/system/useSystem', () => {
  test('useSystem', () => {
    const [system, { mutateSystem, loadingSystem }] = useSystem()
    expect(system).toEqual({ item: 'item' })
    expect(mutateSystem).toBeDefined()
    expect(loadingSystem).toBe(false)

    mutateSystem({})
  })
})
