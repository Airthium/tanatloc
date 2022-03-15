import React from 'react'
import { render } from '@testing-library/react'

import FirefoxWindows from '../firefoxWindows'

describe('components/webgl/fixInfos/firefoxWindows', () => {
  test('render', () => {
    const { unmount } = render(<FirefoxWindows />)

    unmount()
  })
})
