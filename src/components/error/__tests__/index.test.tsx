import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import Error from '..'
import { ServerResponse } from 'http'
import { NextPageContext } from 'next'

const mockReload = jest.fn()
const mockQuery = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    reload: () => mockReload(),
    query: mockQuery()
  })
}))

describe('components/error', () => {
  beforeEach(() => {
    mockReload.mockReset()
    mockQuery.mockReset()
    mockQuery.mockImplementation(() => ({}))
  })

  test('render', () => {
    const { unmount } = render(<Error />)

    unmount()
  })

  test('with webStatusCode', () => {
    const { unmount } = render(<Error webStatusCode={200} />)

    unmount()
  })

  test('refresh without webStatusCode', () => {
    const { unmount } = render(<Error />)

    const text = screen.getByRole('heading', {
      name: 'Please, refresh the page'
    })
    fireEvent.click(text)

    expect(mockReload).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('refresh with webStatusCode', () => {
    const { unmount } = render(<Error webStatusCode={200} />)

    const text = screen.getByRole('heading', {
      name: 'Please, refresh the page'
    })
    fireEvent.click(text)

    expect(mockReload).toHaveBeenCalledTimes(1)

    unmount()
  })

  test('with electron status code 100', () => {
    mockQuery.mockImplementation(() => ({ electronStatusCode: '100' }))
    const { unmount } = render(<Error />)

    const text = screen.getByRole('heading', {
      name: 'An error occurred while installing the application'
    })
    fireEvent.click(text)

    unmount()
  })

  test('with electron status code 200', () => {
    mockQuery.mockImplementation(() => ({ electronStatusCode: '200' }))
    const { unmount } = render(<Error />)

    const text = screen.getByRole('heading', {
      name: 'An error occurred while loading the database'
    })
    fireEvent.click(text)

    unmount()
  })

  test('getInitialProps', () => {
    let code: { webStatusCode?: number }

    const res = {} as ServerResponse
    const err = {} as Error & { statusCode: number | undefined }
    code = Error.getInitialProps({ res, err } as NextPageContext)
    expect(code).toEqual({ webStatusCode: undefined })

    res.statusCode = 200
    code = Error.getInitialProps({ res, err } as NextPageContext)
    expect(code).toEqual({ webStatusCode: 200 })

    code = Error.getInitialProps({ res: undefined, err } as NextPageContext)
    expect(code).toEqual({ webStatusCode: undefined })

    err.statusCode = 200
    code = Error.getInitialProps({ res: undefined, err } as NextPageContext)
    expect(code).toEqual({ webStatusCode: 200 })

    code = Error.getInitialProps({
      res: undefined,
      err: null
    } as NextPageContext)
    expect(code).toEqual({ webStatusCode: 404 })
  })
})
