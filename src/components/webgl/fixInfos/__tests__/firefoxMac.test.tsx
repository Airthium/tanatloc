import { render } from '@testing-library/react'

import FirefoxMac from '../firefoxMac'

describe('components/webgl/fixInfos/firefoxMac', () => {
  test('render', () => {
    const { unmount } = render(<FirefoxMac />)

    unmount()
  })
})
