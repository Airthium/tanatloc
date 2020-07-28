import { useStore } from '../store/store'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

import 'antd/dist/antd.css'
import '../styles/global.css'
import '../styles/Login.css'

const App = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialReduxState)
  const persistor = persistStore(store)

  return (
    <Provider store={store}>
      <PersistGate loading={<Component {...pageProps} />} persistor={persistor}>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  )
}

export default App
