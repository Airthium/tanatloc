import React from 'react'
import { render } from '@testing-library/react'

import Loading from '@/components/loading'

jest.mock('@/components/background', () => 'background')

describe('components/loading', () => {
  test('render', () => {
    const { unmount } = render(<Loading />)

    unmount()
  })

  test('status', () => {
    const { unmount } = render(<Loading status={['test1', 'test2']} />)

    unmount()
  })

  test('status, err', () => {
    const { unmount } = render(
      <Loading
        status={['test1', 'test2']}
        errors={['error', 'docker: command not found', 'ENETUNREACH']}
      />
    )

    unmount()
  })

  test('simple', () => {
    const { unmount } = render(<Loading.Simple />)

    unmount()
  })
})
