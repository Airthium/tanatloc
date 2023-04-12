import { render } from '@testing-library/react'

import Password from '../password.page'

jest.mock('@/components/password', () => () => <div />)

describe('pages/password', () => {
  test('render', () => {
    const { unmount } = render(<Password />)

    unmount()
  })
})
