import { render } from '@testing-library/react'

import WebGL from '@/pages/webgl.page'

jest.mock('@/components/webgl', () => () => <div />)

describe('pages/webgl', () => {
  test('render', () => {
    const { unmount } = render(<WebGL />)

    unmount()
  })
})
