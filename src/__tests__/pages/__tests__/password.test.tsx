import React from 'react'
import { render } from '@testing-library/react'

import Password from '@/pages/password'

jest.mock('@/components/password', () => () => <div />)

describe('pages/password', () => {
  test('render', () => {
    const { unmount } = render(<Password />)

    unmount()
  })
})
