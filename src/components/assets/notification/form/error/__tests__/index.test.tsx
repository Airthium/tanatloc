import { render } from '@testing-library/react'

import { ICallError } from '@/api/index.d'

import { APIError } from '@/api/error'

import FormError from '..'

describe('components/assets/notification/form/error', () => {
  test('minimal', () => {
    const error = new APIError({
      title: 'title'
    })
    const { unmount } = render(<FormError error={error} />)

    unmount()
  })

  test('call error', () => {
    const err = new Error('message') as ICallError
    err.status = 404
    err.info = { message: 'Not found' }
    const error = new APIError({
      title: 'title',
      render: <div />,
      err: err,
      type: 'warning'
    })
    const { unmount } = render(<FormError error={error} />)

    unmount()
  })

  test('empty', () => {
    const { unmount } = render(<FormError error={undefined} />)

    unmount()
  })
})
