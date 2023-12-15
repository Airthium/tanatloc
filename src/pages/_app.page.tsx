/** @module Pages.App */

import Head from 'next/head'
import dynamic from 'next/dynamic'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { ConfigProvider } from 'antd'
import { CookiesProvider } from 'react-cookie'

import NotificationProvider from '@/context/notification'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import MathJax from '@/components/assets/mathjax'
import Cookies from '@/components/assets/cookies'
import GoogleTag from '@/components/assets/gtag'

import theme from '@/styles/theme'

import '@/styles/index.css'
import '@/styles/fonts.css'
import { useCallback } from 'react'

const Canvas = dynamic(
  () => import('@airthium/tanatloc-3d').then((mod) => mod.default.Canvas),
  { ssr: false }
)

/**
 * Global App component
 * @param props Props
 */
const App: React.FunctionComponent<AppProps> = ({ Component, pageProps }) => {
  // Router
  const router = useRouter()

  /**
   * To WebGL
   */
  const toWebGL = useCallback(() => {
    asyncFunctionExec(async () => {
      await router.push('/webgl')
    })
  }, [router])

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
          <Canvas toWebGL={toWebGL} />
          <Cookies />
          <GoogleTag />
        </ConfigProvider>
      </NotificationProvider>
    </CookiesProvider>
  )
}

export default App
