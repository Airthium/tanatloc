import Update from '..'

const mockIsElectron = jest.fn()
jest.mock('is-electron', () => () => mockIsElectron())

const mockFetch = jest.fn()
jest.mock('node-fetch', () => () => mockFetch())

jest.mock('../../../../package.json', () => ({
  version: '1.0.0'
}))

describe('lib/update', () => {
  beforeEach(() => {
    mockIsElectron.mockReset()

    mockFetch.mockReset()
  })

  test('no electron', async () => {
    mockIsElectron.mockImplementation(() => false)
    expect(await Update.isUpdateNeeded()).toBe(false)
  })

  test('correct version', async () => {
    mockIsElectron.mockImplementation(() => true)
    mockFetch.mockImplementation(() => ({
      json: () => ({
        tag_name: '1.0.0'
      })
    }))
    expect(await Update.isUpdateNeeded()).toBe(false)
  })

  test('wrong version', async () => {
    mockIsElectron.mockImplementation(() => true)
    mockFetch.mockImplementation(() => ({
      json: () => ({
        tag_name: '2.0.0'
      })
    }))
    expect(await Update.isUpdateNeeded()).toBe(true)
  })
})
