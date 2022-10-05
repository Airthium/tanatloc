/** @module Components.Editor.Code */

import dynamic from 'next/dynamic'

const FreeFEMCode = dynamic(() => import('./freefem'), { ssr: false })
const JSONCode = dynamic(() => import('./json'), { ssr: false })

/**
 * Code
 */
const Code = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <div className="Editor-code">
      <FreeFEMCode />
      <JSONCode />
    </div>
  )
}

export default Code
