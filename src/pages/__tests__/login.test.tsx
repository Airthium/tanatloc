import { render } from '@testing-library/react'

import Login from '../login.page'

jest.mock('@/components/login', () => () => <div />)

describe('pages/login', () => {
  test('render', () => {
    const { unmount } = render(<Login />)

    unmount()
  })
})
