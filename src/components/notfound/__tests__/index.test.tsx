import { fireEvent, render, screen } from '@testing-library/react'

import NotFound from '@/components/notfound'

const mockRouter = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: async () => mockRouter()
  })
}))

jest.mock('@airthium/tanatloc-3d', () => ({
  __esModule: true,
  default: { extra: { Background: () => <div /> } }
}))

jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return () => <div />
})

Object.defineProperty(global, 'setTimeout', {
  value: (callback: Function) => callback()
})

describe('components/notfound', () => {
  beforeEach(() => {
    mockRouter.mockReset()
  })

  test('render', () => {
    //@ts-ignore
    global.MockScene = {
      children: [
        { type: 'Group', rotateY: jest.fn, children: [{}] },
        { type: 'Other' }
      ]
    }

    const { unmount } = render(<NotFound />)

    unmount()
  })

  test('onClick', () => {
    const { unmount } = render(<NotFound />)

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockRouter).toHaveBeenCalledTimes(1)

    unmount()
  })
})
