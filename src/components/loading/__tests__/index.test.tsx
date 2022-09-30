import React from 'react'
import { render } from '@testing-library/react'

import Loading from '@/components/loading'

jest.mock('@/components/background', () => 'background')

Element.prototype.scrollTo = () => {}

describe('components/loading', () => {
  test('render', async () => {
    const { unmount } = render(<Loading />)

    unmount()
  })

  test('status', async () => {
    const { unmount } = render(<Loading status={['test1', 'test2']} />)

    unmount()
  })

  test('status, err', async () => {
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
