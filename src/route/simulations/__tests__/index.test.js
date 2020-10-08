import simulations from '..'

describe('src/route/simulations', () => {
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
