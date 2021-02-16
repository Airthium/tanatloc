import update from '../update'

jest.mock('../..', () => async () => {})

describe('database/system/update', () => {
  it('call', async () => {
    await update(['item'])
  })
})
