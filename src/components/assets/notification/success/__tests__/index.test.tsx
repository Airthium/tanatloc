import { render } from '@testing-library/react'

import Success from '..'

describe('components/assets/notification/success', () => {
  test('render', () => {
    const { unmount } = render(<Success />)

    unmount()
  })
})
