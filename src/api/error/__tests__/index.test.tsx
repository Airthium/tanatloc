import { APIError } from '..'

describe('api/error', () => {
  test('call', () => {
    const err = new APIError({
      title: 'title',
      render: <div />,
      err: new Error('error'),
      type: 'warning'
    })

    expect(err.message).toBe('title')
    expect(err.title).toBe('title')
    expect(err.render).toEqual(<div />)
    expect(err.err).toBeInstanceOf(Error)
    expect(err.type).toBe('warning')
  })
})
