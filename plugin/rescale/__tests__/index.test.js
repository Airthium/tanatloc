import Rescale from '../'

jest.mock('../logo.svg', () => 'logo')

describe('plugins/rescale', () => {
  it('call', () => {
    expect(Rescale).toBeDefined()
    expect(Rescale.key).toBeDefined()
  })
})
