import Email from '../'

jest.mock('mailersend', () => ({
  __esModule: true,
  default: class {
    send() {}
  },
  Recipient: class {},
  EmailParams: class mockEmailParams {
    setFrom() {
      return {
        setFromName: () => ({
          setRecipients: () => ({
            setSubject: () => ({
              setHtml: () => {}
            })
          })
        })
      }
    }
  }
}))

jest.mock('@/config/email', () => ({
  TOKEN: 'TOKEN'
}))

describe('src/lib/email', () => {
  it('subscribe', () => {
    Email.subscribe('email', 'id')
  })
})
