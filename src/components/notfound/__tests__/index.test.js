import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import NotFound from '@/components/notfound'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: () => mockRouter()
  })
}))

describe('components/notfound', () => {
  beforeEach(() => {
    mockRouter.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<NotFound />)

    unmount()
  })

  // test('onClick', () => {
  //   wrapper.find('Title').at(2).props().onClick()
  //   expect(mockRouter).toHaveBeenCalledTimes(1)
  // })
})
