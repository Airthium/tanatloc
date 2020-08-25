import { useStore } from '../store/store'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import '../styles/global.less'

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
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default App
