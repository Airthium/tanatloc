import update from '../update'

jest.mock('../..', () => async () => {})

describe('src/database/quary/workspace/update', () => {
  it('update', async () => {
    await update({ workspace: {}, data: { test: 'test' } })
  })
})
