/** @module Components.WebGL */

import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

// Tanatloc3D WebGL
const WebGL = dynamic(
  () => import('@airthium/tanatloc-3d').then((mod) => mod.default.extra.WebGL),
  { ssr: false }
)

import globalStyle from '@/styles/index.module.css'

/**
 * Errors
 */
export const errors = {
  webGL: 'WebGL is not enabled on your device. Please enable it.'
}

/**
 * WebGL error
 * @returns WebGLError
 */
const WebGLError: React.FunctionComponent = () => {
  // Data
  const router = useRouter()

  /**
   * Back
   */
  const back = useCallback((): void => router.back(), [router])

  /**
   * Render
   */
  return (
    <WebGL
      logo={
        <div className={globalStyle.logo}>
          <img src="/images/logo.svg" alt="Tanatloc" />
        </div>
      }
      back={back}
    />
  )
}

export default WebGLError
