import del from '../delete'

jest.mock('../../..', () => async () => {})

describe('src/database/quary/workspace/delete', () => {
  it('delete', async () => {
    await del('id', {})
  })
})
