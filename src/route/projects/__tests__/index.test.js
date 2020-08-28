import projects from '..'

describe('src/route/projects', () => {
  const req = {}
  const end = jest.fn()
  const res = {
    status: () => ({
      end: end
    })
  }

  it('call', async () => {
    await projects(req, res)
    expect(end).toHaveBeenCalledTimes(1)
  })
})
