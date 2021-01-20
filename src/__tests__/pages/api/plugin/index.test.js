import plugin from '../../../../pages/api/plugin'

jest.mock('../../../../../src/route/plugin', () => () => {})

describe('pages/api/plugin', () => {
  it('call', async () => {
    await plugin()
  })
})
