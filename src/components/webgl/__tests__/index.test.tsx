import { fireEvent, render, screen } from '@testing-library/react'

import WebGL from '..'

const mockBack = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    back: () => mockBack()
  })
}))

const WebGLRole = 'WebGL'
jest.mock('@airthium/tanatloc-3d', () => ({
  __esModule: true,
  default: {
    extra: {
      WebGL: () => <div />
    }
  }
}))

jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return (props: any) => (
    <div role={WebGLRole} onClick={props.back} onKeyDown={console.debug} />
  )
})

describe('components/webgl', () => {
  beforeEach(() => {
    mockBack.mockReset()
  })

  test('render', () => {
    const { unmount } = render(<WebGL />)

    unmount()
  })

  test('back', () => {
    const { unmount } = render(<WebGL />)

    const button = screen.getByRole(WebGLRole)
    fireEvent.click(button)
    expect(mockBack).toHaveBeenCalledTimes(1)

    unmount()
  })
})
