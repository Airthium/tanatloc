import id from '../../../../pages/api/projects/[ids]'

jest.mock('../../../../../src/route/projects/[ids]', () => () => {})

describe('pages/api/project/[id]', () => {
  it('call', async () => {
    await id()
  })
})
