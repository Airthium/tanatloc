import Email from '../'

jest.mock('@/config/email', () => ({
  TOKEN: '',
  SUBSCRIBE: 'SUBSCRIBE',
  PASSWORD_RECOVERY: 'PASSWORD_RECOVERY',
  REVALIDATE: 'REVALIDATE'
}))

const mockSend = jest.fn()
jest.mock('mailersend', () => ({
  __esModule: true,
  MailerSend: class {
    send() {
      return mockSend()
    }
  },
  Recipient: class {},
  EmailParams: class mockEmailParams {
    setFrom() {
      return this
    }
    setTo() {
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
  },
  Sender: class {}
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
    // No token
    await Email.subscribe('email', 'id')
    expect(mockLinkAdd).toHaveBeenCalledTimes(1)
    expect(mockSend).toHaveBeenCalledTimes(0)
    expect(mockUserUpdate).toHaveBeenCalledTimes(1)
  })
})
