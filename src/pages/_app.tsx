/** @module Pages.App */

import Head from 'next/head'
import { AppProps } from 'next/app'

import MathJax from '@/components/assets/mathjax'

require('@/styles/global.less')

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
    <>
      <Head>
        <title>Tanatloc</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <MathJax.Head />
      <Component {...pageProps} />
    </>
  )
}

export default App
