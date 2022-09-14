import React from 'react'
import { render } from '@testing-library/react'

import Loading from '@/components/loading'

jest.mock('@/components/background', () => 'background')

describe('components/loading', () => {
  test('render', () => {
    const { unmount } = render(<Loading />)

    unmount()
  })

  test('description', () => {
    const { unmount } = render(<Loading description={['test']} />)

    unmount()
  })

  test('simple', () => {
    const { unmount } = render(<Loading.Simple />)

    unmount()
  })
})
