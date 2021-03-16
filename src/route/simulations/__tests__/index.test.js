import simulations from '..'

describe('route/simulations', () => {
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
    await simulations(req, res)
    expect(response).toEqual({ simulations: [] })
  })
})
