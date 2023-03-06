import { render } from '@testing-library/react'

import Account from '..'

jest.mock('@/components/assets/carousel', () => () => <div />)

describe('components/doc/dashboard/account', () => {
  test('render', () => {
    const { unmount } = render(<Account />)

    unmount()
  })
})
