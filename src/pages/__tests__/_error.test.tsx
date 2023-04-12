import { render } from '@testing-library/react'

import Error from '../_error.page'

jest.mock('@/components/error', () => () => <div />)

describe('pages/_error', () => {
  test('render', () => {
    const { unmount } = render(<Error />)

    unmount()
  })
})
