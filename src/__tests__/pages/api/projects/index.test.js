import project from '../../../../pages/api/projects'

jest.mock('../../../../../src/route/projects', () => () => {})

describe('pages/api/projects', () => {
  it('call', async () => {
    await project()
  })
})
