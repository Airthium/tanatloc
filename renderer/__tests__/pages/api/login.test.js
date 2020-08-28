import login from '../../../pages/api/login'

jest.mock('../../../../src/route/login', () => () => {})

describe('pages/api/login', () => {
  it('call', async () => {
    await login()
  })
})
