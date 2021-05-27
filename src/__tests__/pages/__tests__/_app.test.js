import React from 'react'
import { render } from '@testing-library/react'

import App from '@/pages/_app'

jest.mock('@/store/store', () => ({
  useStore: jest.fn()
}))

jest.mock('react-redux', () => ({
  Provider: 'provider'
}))

jest.mock('redux-persist', () => ({
  persistStore: jest.fn()
}))

jest.mock('redux-persist/integration/react', () => ({
  PersistGate: 'persistGate'
}))

jest.mock('@/styles/antd.less', () => '')
jest.mock('@/styles/global.less', () => '')

describe('pages/_app', () => {
  test('render', () => {
    const { unmount } = render(<App Component="component" pageProps={{}} />)

    unmount()
  })
})
