import React from 'react'
import { render } from '@testing-library/react'

import Error from '..'

const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => () => ({
    reload: () => mockReload()
  })
}))

describe('components/error', () => {
  test('render', () => {
    const { unmount } = render(<Error />)

    unmount()
  })

  test('with statusCode', () => {
    const { unmount } = render(<Error statusCode={200} />)

    unmount()
  })

  test('getInitialProps', () => {
    let code

    const res = {}
    const err = {}
    code = Error.getInitialProps({ res, err })
    expect(code).toEqual({ statusCode: undefined })

    res.statusCode = 200
    code = Error.getInitialProps({ res, err })
    expect(code).toEqual({ statusCode: 200 })

    code = Error.getInitialProps({ res: null, err })
    expect(code).toEqual({ statusCode: undefined })

    err.statusCode = 200
    code = Error.getInitialProps({ res: null, err })
    expect(code).toEqual({ statusCode: 200 })

    code = Error.getInitialProps({ res: null, err: null })
    expect(code).toEqual({ statusCode: 404 })
  })
})
