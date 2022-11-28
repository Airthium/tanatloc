import { render } from '@testing-library/react'

import Dashboard from '@/pages/dashboard'

jest.mock('@/components/dashboard', () => () => <div />)

describe('pages/dashboard', () => {
  test('render', () => {
    const { unmount } = render(<Dashboard />)

    unmount()
  })
})
