import { render } from '@testing-library/react'

import Index from '@/pages/index'

jest.mock('@/components/indexpage', () => () => <div />)

describe('pages/index', () => {
  test('render', () => {
    const { unmount } = render(<Index />)

    unmount()
  })
})
