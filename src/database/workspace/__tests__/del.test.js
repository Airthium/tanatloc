import del from '../del'

jest.mock('../..', () => async () => {})

describe('src/database/quary/workspace/delete', () => {
  it('delete', async () => {
    await del('id', {})
  })
})
