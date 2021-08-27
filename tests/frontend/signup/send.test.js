import React from 'react'
import { render } from '@testing-library/react'

import Send from '@/pages/signup/send'

describe('e2e/frontend/signup/send', () => {
  test('render', () => {
    const { unmount } = render(<Send />)

    unmount()
  })
})
