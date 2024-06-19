import { fireEvent, screen, render } from '@testing-library/react'

import App from '../_app.page'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

jest.mock('@sentry/nextjs', () => ({ init: jest.fn }))

const CanvasRole = 'Canvas'
jest.mock('@airthium/tanatloc-3d', () => ({
  __esModule: true,
  default: { Canvas: () => <div /> }
}))
jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return (props: any) => <button role={CanvasRole} onClick={props.toWebGL} />
})

jest.mock('@/components/assets/mathjax', () => ({
  Head: () => <></>
}))

jest.mock('@/components/assets/cookies', () => () => <div />)

jest.mock('@/components/assets/gtag', () => () => <div />)

jest.mock('@/styles/index.css', () => '')
jest.mock('@/styles/fonts.css', () => '')

describe('pages/_app', () => {
  beforeEach(() => {
    mockPush.mockReset()
  })

  test('render', () => {
    //@ts-ignore
    const { unmount } = render(<App Component="div" pageProps={{}} />)

    unmount()
  })

  test('toWebGL', () => {
    //@ts-ignore
    const { unmount } = render(<App Component="div" pageProps={{}} />)

    const canvas = screen.getByRole(CanvasRole)
    fireEvent.click(canvas)

    expect(mockPush).toHaveBeenCalledTimes(1)

    unmount()
  })
})
