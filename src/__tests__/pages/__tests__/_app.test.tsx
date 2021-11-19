import React from 'react'
import { render } from '@testing-library/react'

import App from '@/pages/_app'

jest.mock('@/store/store', () => ({
  useStore: jest.fn()
}))

jest.mock('react-redux', () => ({
  Provider: 'Provider'
}))

jest.mock('redux-persist', () => ({
  persistStore: jest.fn()
}))

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: 'PersistGate'
}))

jest.mock('@/styles/global.less', () => '')

describe('pages/_app', () => {
  test('render', () => {
    //@ts-ignore
    const { unmount } = render(<App Component="div" pageProps={{}} />)

    unmount()
  })
})
