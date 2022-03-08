import React from 'react'
import { render } from '@testing-library/react'

import Organizations from '../'

let wrapper
describe('components/help/doc/organizations', () => {
  test('render', () => {
    const { unmount } = render(<Organizations />)

    unmount()
  })
})
