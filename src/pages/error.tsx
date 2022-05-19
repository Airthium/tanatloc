/** @module Pages.Error */

import Error from '@/components/error'
import React from 'react'

/**
 * Error page
 */
const error = (): JSX.Element => {
  const [statusCode, setStatusCode] = React.useState<number>(404)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams: URLSearchParams = new URLSearchParams(
        (window as any).location.search
      )
      setStatusCode(parseInt(urlParams.get('statusCode') || '404', 10))
    }
  }, [])

  /**
   * Render
   */
  return <Error statusCode={statusCode} />
}

export default error
