import React from 'react'
import { render } from '@testing-library/react'

import Start from '..'

describe('components/start', () => {
  test('render', () => {
    const { unmount } = render(<Start />)

    unmount()
  })
})
