import React from 'react'
import { render } from '@testing-library/react'

import Help from '@/components/help'

let wrapper
describe('components/help', () => {
  test('render', () => {
    const { unmount } = render(<Help />)

    unmount()
  })
})
