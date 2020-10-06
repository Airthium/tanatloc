import simulations from '..'

describe('src/route/simulations', () => {
  const req = {}
  const end = jest.fn()
  const res = {
    status: () => ({
      end: end
    })
  }

  it('call', async () => {
    await simulations(req, res)
    expect(end).toHaveBeenCalledTimes(1)
  })
})
