import { render } from '@testing-library/react'

import Doc from '../doc.page'

jest.mock('@/components/doc', () => () => <div />)

describe('pages/doc', () => {
  test('render', () => {
    const { unmount } = render(<Doc />)

    unmount()
  })
})
