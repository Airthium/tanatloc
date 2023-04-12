import { render } from '@testing-library/react'

import App from '../_app.page'

jest.mock('@/components/assets/mathjax', () => ({
  Head: () => <></>
}))

jest.mock('@/styles/index.css', () => '')
jest.mock('@/styles/fonts.css', () => '')

describe('pages/_app', () => {
  test('render', () => {
    //@ts-ignore
    const { unmount } = render(<App Component="div" pageProps={{}} />)

    unmount()
  })
})
