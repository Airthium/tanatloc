import { render } from '@testing-library/react'

import Editor from '..'

describe('components/doc/dashboard/editor', () => {
  test('render', () => {
    const { unmount } = render(<Editor />)

    unmount()
  })
})
