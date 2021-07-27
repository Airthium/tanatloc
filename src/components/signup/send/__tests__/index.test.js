import React from 'react'
import { render } from '@testing-library/react'

import Send from '..'

describe('components/signup/send', () => {
  test('render', () => {
    const { unmount } = render(<Send />)

    unmount()
  })
})
