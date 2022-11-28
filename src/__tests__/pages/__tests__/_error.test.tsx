import { render } from '@testing-library/react'

import Error from '@/pages/_error'

jest.mock('@/components/error', () => () => <div />)

describe('pages/_error', () => {
  test('render', () => {
    const { unmount } = render(<Error />)

    unmount()
  })
})
