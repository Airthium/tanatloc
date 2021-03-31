import groups from '..'

describe('route/groups', () => {
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
    await groups(req, res)
    expect(response).toEqual({ groups: [] })
  })
})
