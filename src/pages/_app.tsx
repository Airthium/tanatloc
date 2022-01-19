import Head from 'next/head'
import { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { useStore } from '@/store/store'
import React from 'react'

require('@/styles/global.less')

/**
 * Global App component
 * @memberof Pages
 * @param {Object} param0 {Component, pageProps}
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
          <script
            async
            src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
          ></script>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default App
