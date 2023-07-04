/** @module Pages.App */

import Head from 'next/head'
import { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'
import { CookiesProvider } from 'react-cookie'

import NotificationProvider from '@/context/notification'

import MathJax from '@/components/assets/mathjax'
import Cookies from '@/components/assets/cookies'
import GoogleTag from '@/components/assets/gtag'

import theme from '@/styles/theme'

import '@/styles/index.css'
import '@/styles/fonts.css'

/**
 * Global App component
 * @param props Props
 */
const App = ({ Component, pageProps }: AppProps): React.JSX.Element => {
  /**
   * Render
   */
  return (
    <CookiesProvider>
      <NotificationProvider>
        <ConfigProvider theme={theme}>
          <Head>
            <title>Tanatloc</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            ></meta>
          </Head>
          <MathJax.Head />
          <Component {...pageProps} />
          <Cookies />
          <GoogleTag />
        </ConfigProvider>
      </NotificationProvider>
    </CookiesProvider>
  )
}

export default App
