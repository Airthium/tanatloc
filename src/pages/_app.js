import Head from 'next/head'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import { useStore } from '@/store/store'

import '@/styles/global.less'

/**
 * Global App component
 * @memberof module:pages
 * @param {Object} param0 {Component, pageProps}
 */
const App = ({ Component, pageProps }) => {
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
          <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          ></meta>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default App
