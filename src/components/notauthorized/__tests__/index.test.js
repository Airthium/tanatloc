import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import NotAuthorized from '@/components/notauthorized'

const mockPrefetch = jest.fn()
const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    prefetch: mockPrefetch,
    push: mockPush
  })
}))

describe('components/notfound', () => {
  beforeEach(() => {
    mockPrefetch.mockReset()
    mockPush.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<NotAuthorized />)
    unmount()
  })

  // test('onClick', () => {
  //   wrapper.find({ type: 'link' }).props().onClick()
  //   expect(mockPush).toHaveBeenCalledTimes(1)
  // })

  // // test('effect', () => {
  // //   wrapper.unmount()

  // //   wrapper = mount(<NotAuthorized />)
  // //   expect(mockPrefetch).toHaveBeenCalledTimes(1)
  // // })
})
