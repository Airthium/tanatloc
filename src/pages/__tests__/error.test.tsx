import { render } from '@testing-library/react'

import Error from '../error.page'

jest.mock('@/components/error', () => () => <div />)

describe('pages/error', () => {
  test('render', () => {
    const { unmount } = render(<Error />)

    unmount()
  })
})
