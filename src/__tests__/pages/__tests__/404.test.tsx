import { render } from '@testing-library/react'

import NotFound from '@/pages/404'

jest.mock('@/components/notfound', () => () => <div />)

describe('pages/404', () => {
  test('render', () => {
    const { unmount } = render(<NotFound />)

    unmount()
  })
})
