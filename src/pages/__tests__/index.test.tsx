import { render } from '@testing-library/react'

import Index from '../index.page'

jest.mock('@/components/indexpage', () => () => <div />)

describe('pages/index', () => {
  test('render', () => {
    const { unmount } = render(<Index />)

    unmount()
  })
})
