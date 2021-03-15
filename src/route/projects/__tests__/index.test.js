import projects from '..'

describe('route/projects', () => {
  let response
  const req = {}
  const res = {
    status: () => ({
      json: (obj) => {
        response = obj
      }
    })
  }

  it('call', async () => {
    await projects(req, res)
    expect(response).toEqual({ projects: [] })
  })
})
