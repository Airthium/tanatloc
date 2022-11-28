import { render } from '@testing-library/react'

import Start from '@/pages/start'

jest.mock('@/components/start', () => () => <div />)

describe('pages/start', () => {
  test('render', () => {
    const { unmount } = render(<Start />)

    unmount()
  })
})
