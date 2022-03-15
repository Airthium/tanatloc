import React from 'react'
import { render } from '@testing-library/react'

import NoManipBrowser from '../noManipBrowser'

describe('components/webgl/fixInfos/noManipBrowser', () => {
  test('render', () => {
    const { unmount } = render(<NoManipBrowser />)

    unmount()
  })
})
