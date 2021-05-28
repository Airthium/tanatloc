import React from 'react'
import { render } from '@testing-library/react'

import Administration from '../'

describe('components/help/doc/administration', () => {
  test('render', () => {
    const { unmount } = render(<Administration />)

    unmount()
  })
})
