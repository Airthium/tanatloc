import { render } from '@testing-library/react'

import App from '../_app.page'

jest.mock('@airthium/tanatloc-3d', () => ({
  __esModule: true,
  default: { Canvas: () => <div /> }
}))
jest.mock('next/dynamic', () => (callback: Function) => {
  callback()
  return () => <div />
})

jest.mock('@/components/assets/mathjax', () => ({
  Head: () => <></>
}))

jest.mock('@/components/assets/cookies', () => () => <div />)

jest.mock('@/components/assets/gtag', () => () => <div />)

jest.mock('@/styles/index.css', () => '')
jest.mock('@/styles/fonts.css', () => '')

describe('pages/_app', () => {
  test('render', () => {
    //@ts-ignore
    const { unmount } = render(<App Component="div" pageProps={{}} />)

    unmount()
  })
})
