/** @module Pages.App */

import Head from 'next/head'
import dynamic from 'next/dynamic'
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

const Canvas = dynamic(
  () => import('@airthium/tanatloc-3d').then((mod) => mod.default.Canvas),
  { ssr: false }
)

/**
 * Global App component
 * @param props Props
 */
const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
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
          <Canvas />
          <Cookies />
          <GoogleTag />
        </ConfigProvider>
      </NotificationProvider>
    </CookiesProvider>
  )
}

export default App
