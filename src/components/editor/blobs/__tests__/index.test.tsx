import { render } from '@testing-library/react'

import Blobs from '..'

describe('components/editor/blobs', () => {
  test('render', () => {
    const { unmount } = render(<Blobs />)

    unmount()
  })
})
