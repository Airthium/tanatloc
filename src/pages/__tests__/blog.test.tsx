import { render } from '@testing-library/react'

import Blog from '../blog.page'

jest.mock('@/components/blog', () => () => <div />)

describe('pages/blog', () => {
  test('render', () => {
    const { unmount } = render(<Blog />)

    unmount()
  })
})
