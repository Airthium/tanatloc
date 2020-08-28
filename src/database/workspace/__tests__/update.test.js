import update from '../update'

jest.mock('../..', () => ({
  updater: async () => {}
}))

describe('src/database/workspace/update', () => {
  it('update', async () => {
    await update({ workspace: {}, data: [{ key: 'test', value: 'test' }] })
  })
})
