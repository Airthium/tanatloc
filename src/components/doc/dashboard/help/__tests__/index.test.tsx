import { render } from '@testing-library/react'

import Help from '..'

jest.mock('@/components/assets/carousel', () => () => <div />)

describe('components/doc/dashboard/help', () => {
  test('render', () => {
    const { unmount } = render(<Help />)

    unmount()
  })
})
