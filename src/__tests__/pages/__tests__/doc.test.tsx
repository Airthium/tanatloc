import { render } from '@testing-library/react'

import Doc from '@/pages/doc'

jest.mock('@/components/doc', () => () => <div />)

describe('pages/doc', () => {
  test('render', () => {
    const { unmount } = render(<Doc />)

    unmount()
  })
})
