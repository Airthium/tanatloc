import { render } from '@testing-library/react'

import NotFound from '../404.page'

jest.mock('@/components/notfound', () => () => <div />)

describe('pages/404', () => {
  test('render', () => {
    const { unmount } = render(<NotFound />)

    unmount()
  })
})
