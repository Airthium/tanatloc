import Email from '../'

let mockStatus = 202
let mockStatusText = 'Success'
jest.mock('mailersend', () => ({
  __esModule: true,
  default: class {
    send() {
      return { status: mockStatus, statusText: mockStatusText }
    }
  },
  Recipient: class {},
  EmailParams: class mockEmailParams {
    setFrom() {
      return this
    }
    setFromName() {
      return this
    }
    setRecipients() {
      return this
    }
    setSubject() {
      return this
    }
    setTemplateId() {
      return this
    }
    setPersonalization() {
      return this
    }
  }
}))

const mockLinkAdd = jest.fn()
const mocKLinkDel = jest.fn()
jest.mock('../../link', () => ({
  add: async () => mockLinkAdd(),
  del: async () => mocKLinkDel()
}))

describe('lib/email', () => {
  beforeEach(() => {
    mockLinkAdd.mockReset()
    mockLinkAdd.mockImplementation(() => ({}))

    mocKLinkDel.mockReset()
  })

  test('subscribe', async () => {
    await Email.subscribe('email', 'id')
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
  })

  test('recover', async () => {
    await Email.recover('email')
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
  })

  test('send error', async () => {
    mockStatus = 401
    mockStatusText = 'Unauthorized'

    try {
      await Email.recover('email')
    } catch (err) {
      expect(err.message).toBe('Mail error: Unauthorized')
    }
  })
})
