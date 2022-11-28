import { render } from '@testing-library/react'

import App from '@/pages/_app'

jest.mock('@/components/assets/mathjax', () => ({
  Head: () => <></>
}))

jest.mock('@/styles/global.less', () => '')

describe('pages/_app', () => {
  test('render', () => {
    //@ts-ignore
    const { unmount } = render(<App Component="div" pageProps={{}} />)

    unmount()
  })
})
