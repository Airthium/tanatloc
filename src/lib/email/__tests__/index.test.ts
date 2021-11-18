import Email from '../'

const mockSend = jest.fn()
jest.mock('mailersend', () => ({
  __esModule: true,
  default: class {
    send() {
      return mockSend()
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
const mockLinkDel = jest.fn()
jest.mock('../../link', () => ({
  add: async () => mockLinkAdd(),
  del: async () => mockLinkDel()
}))

const mockUserUpdate = jest.fn()
jest.mock('../../user', () => ({
  update: async () => mockUserUpdate()
}))

describe('lib/email', () => {
  beforeEach(() => {
    mockSend.mockReset()
    mockSend.mockImplementation(() => ({
      status: 202,
      statusText: 'Success'
    }))

    mockLinkAdd.mockReset()
    mockLinkAdd.mockImplementation(() => ({}))
    mockLinkDel.mockReset()

    mockUserUpdate.mockReset()
  })

  test('subscribe', async () => {
    // Normal
    await Email.subscribe('email', 'id')
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledTimes(1)

    // Error
    mockSend.mockImplementation(() => ({
      status: 422,
      statusText: 'Unprocessable Entity'
    }))
    try {
      await Email.subscribe('email', 'id')
    } catch (err) {
      expect(mockLinkAdd).toHaveBeenCalledTimes(2)
      expect(mockSend).toHaveBeenCalledTimes(2)
      expect(mockLinkDel).toHaveBeenCalledTimes(1)
      expect(err.message).toBe('Mail error: Unprocessable Entity')
    }

    // Unauthorized
    mockSend.mockImplementation(() => ({
      status: 401,
      statusText: 'Unauthorized'
    }))
    await Email.subscribe('email', 'id')
    expect(mockLinkAdd).toHaveBeenCalledTimes(3)
    expect(mockSend).toHaveBeenCalledTimes(3)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
  })

  test('recover', async () => {
    // Normal
    await Email.recover('email')
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledTimes(1)

    // Error
    mockSend.mockImplementation(() => ({
      status: 422,
      statusText: 'Unprocessable Entity'
    }))
    try {
      await Email.recover('email')
    } catch (err) {
      expect(mockLinkAdd).toHaveBeenCalledTimes(2)
      expect(mockSend).toHaveBeenCalledTimes(2)
      expect(mockLinkDel).toHaveBeenCalledTimes(1)
      expect(err.message).toBe('Mail error: Unprocessable Entity')
    }
  })

  test('revalidate', async () => {
    // Normal
    await Email.revalidate('email', 'id')
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledTimes(1)

    // Error
    mockSend.mockImplementation(() => ({
      status: 422,
      statusText: 'Unprocessable Entity'
    }))
    try {
      await Email.revalidate('email', 'id')
    } catch (err) {
      expect(mockLinkAdd).toHaveBeenCalledTimes(2)
      expect(mockSend).toHaveBeenCalledTimes(2)
      expect(mockLinkDel).toHaveBeenCalledTimes(1)
      expect(err.message).toBe('Mail error: Unprocessable Entity')
    }
  })

  test('invite', async () => {
    // Normal
    await Email.invite('email', { email: 'email' })
    expect(mockLinkAdd).toHaveBeenCalledTimes(0)
    expect(mockSend).toHaveBeenCalledTimes(1)

    // Normal with data
    await Email.invite('email', {
      email: 'email',
      firstname: 'firstname',
      lastname: 'lastname'
    })
    expect(mockLinkAdd).toHaveBeenCalledTimes(0)
    expect(mockSend).toHaveBeenCalledTimes(2)
  })
})
