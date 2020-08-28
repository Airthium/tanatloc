import project from '../../../../pages/api/project'

jest.mock('../../../../../src/route/project', () => () => {})

describe('pages/api/project', () => {
  it('call', async () => {
    await project()
  })
})
