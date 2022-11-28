import { render } from '@testing-library/react'

import SafariMac from '../safariMac'

describe('components/webgl/fixInfos/safariMac', () => {
  test('render', () => {
    const { unmount } = render(<SafariMac />)

    unmount()
  })
})
