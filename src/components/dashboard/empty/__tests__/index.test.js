import React from 'react'
import { render } from '@testing-library/react'

import Empty from '..'

describe('components/dashboard/empty', () => {
  test('render', () => {
    const { unmount } = render(<Empty />)

    unmount()
  })
})
