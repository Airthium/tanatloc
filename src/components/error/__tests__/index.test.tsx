import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Error from '..'

const mockReload = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
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

  test('refresh', () => {
    const { unmount } = render(<Error />)

    const text = screen.getByRole('heading', {
      name: 'Please, refresh the page'
    })
    fireEvent.click(text)

    expect(mockReload).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('getInitialProps', () => {
    let code: { statusCode?: number }

    const res: { statusCode?: number } = {}
    const err: { statusCode?: number } = {}
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
