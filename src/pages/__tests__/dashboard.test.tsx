import { render } from '@testing-library/react'

import Dashboard from '../dashboard.page'

jest.mock('@/components/dashboard', () => () => <div />)

describe('pages/dashboard', () => {
  test('render', () => {
    const { unmount } = render(<Dashboard />)

    unmount()
  })
})
