import useSystem from '../useSystem'

jest.mock('swr', () => () => ({
  data: { system: { item: 'item' } },
  mutate: jest.fn()
}))

describe('/src/api/system/useSystem', () => {
  it('useSystem', () => {
    const [system, { mutateSystem, loadingSystem }] = useSystem()
    expect(system).toEqual({ item: 'item' })
    expect(mutateSystem).toBeDefined()
    expect(loadingSystem).toBe(false)
  })
})
