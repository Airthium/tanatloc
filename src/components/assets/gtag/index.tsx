/** @module Components.Assets.GTag */

import { useEffect } from 'react'
import { useCookies } from 'react-cookie'

/**
 * Google tag
 * @returns GoogleTag
 */
const GoogleTag = (): null => {
  // Data
  const [cookies] = useCookies(['gpdr-gtag-accept'])

  // Check cookie
  useEffect(() => {
    if (!cookies['gpdr-gtag-accept']) return

    const script = document.createElement('script')
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NYKWRV173F'
    script.async = true
    document.body.appendChild(script)

    script.onload = () => {
      const win: any = window
      win.dataLayer = win.dataLayer || []
      function gtag(..._args: any[]) {
        win.dataLayer.push(arguments)
      }
      gtag('js', new Date())
      gtag('config', 'G-NYKWRV173F')
    }
    script.onerror = () => {
      console.error('An error occurs with Google Analytics script')
    }

    return () => {
      document.body.removeChild(script)
    }
  }, [cookies])

  /**
   * Render
   */
  return null
}

export default GoogleTag
