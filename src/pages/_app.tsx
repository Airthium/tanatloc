/** @module Pages.App */

import Head from 'next/head'
import { AppProps } from 'next/app'
import { ConfigProvider } from 'antd'

import MathJax from '@/components/assets/mathjax'

import theme from '@/styles/theme'

import '@/styles/fonts.css'

/**
 * Global App component
 * @param props Props
 */
const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  // Redux

  /**
   * Render
   */
  return (
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
    </ConfigProvider>
  )
}

export default App
