import React from 'react'
import { render } from '@testing-library/react'

import Signup from '@/pages/signup'

jest.mock('@/components/signup', () => () => <div />)

describe('pages/signup', () => {
  test('render', () => {
    const { unmount } = render(<Signup />)

    unmount()
  })
})
