/** @module Pages.App */

import Head from 'next/head'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { useStore } from '@/store/store'

import MathJax from '@/components/assets/mathjax'

require('@/styles/global.less')

/**
 * Global App component
 * @param props Props
 */
const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  // Redux
  const store = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store)

  /**
   * Render
   */
  return (
    <Provider store={store}>
      <PersistGate loading={<Component {...pageProps} />} persistor={persistor}>
        <Head>
          <title>Tanatloc</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
        </Head>
        <MathJax.Head />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default App
