import Update from '..'

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

jest.mock('../../../../package.json', () => ({
  version: '1.0.0'
}))

const mockFetch = jest.fn()
Object.defineProperty(global, 'fetch', { value: mockFetch })

describe('lib/update', () => {
  beforeEach(() => {
    mockIsElectron.mockReset()
  })

  test('no electron', async () => {
    mockIsElectron.mockImplementation(() => false)
    expect(await Update.needUpdate()).toEqual({ needed: false })
  })

  test('correct version', async () => {
    mockIsElectron.mockImplementation(() => true)
    mockFetch.mockImplementation(() => ({
      json: () => ({
        tag_name: '1.0.0'
      })
    }))
    expect(await Update.needUpdate()).toEqual({
      needed: false,
      res: { tag_name: '1.0.0' }
    })
  })

  test('wrong version', async () => {
    mockIsElectron.mockImplementation(() => true)
    mockFetch.mockImplementation(() => ({
      json: () => ({
        tag_name: '2.0.0'
      })
    }))
    expect(await Update.needUpdate()).toEqual({
      needed: true,
      res: { tag_name: '2.0.0' }
    })
  })
})
