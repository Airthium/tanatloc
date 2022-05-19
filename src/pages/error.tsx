/** @module Pages.Error */

import Error from '@/components/error'

/**
 * Error page
 */
const error = (): JSX.Element => {

  const urlParams: URLSearchParams = new URLSearchParams(window.location.search)
  const statusCode: number = parseInt(urlParams.get('statusCode') || '404', 10)
  /**
   * Render
   */
  return <Error statusCode={statusCode}/>
}

export default error
