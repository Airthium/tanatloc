import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Error from '..'
import { ServerResponse } from 'http'
import { NextPageContext } from 'next'

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
    const { unmount } = render(<Error webStatusCode={200} />)

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
    let code: { webStatusCode?: number }

    const res = {} as ServerResponse
    const err = {} as Error & { statusCode: number | undefined }
    code = Error.getInitialProps({ res, err } as NextPageContext)
    expect(code).toEqual({ statusCode: undefined })

    res.statusCode = 200
    code = Error.getInitialProps({ res, err } as NextPageContext)
    expect(code).toEqual({ statusCode: 200 })

    code = Error.getInitialProps({ res: undefined, err } as NextPageContext)
    expect(code).toEqual({ statusCode: undefined })

    err.statusCode = 200
    code = Error.getInitialProps({ res: undefined, err } as NextPageContext)
    expect(code).toEqual({ statusCode: 200 })

    code = Error.getInitialProps({
      res: undefined,
      err: null
    } as NextPageContext)
    expect(code).toEqual({ statusCode: 404 })
  })
})
