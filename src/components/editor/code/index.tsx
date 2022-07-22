import React from 'react'
import FreeFEMCode from './freefem_editor'
import JsonCode from './json_editor'

/**
 * Code
 */
const Code = () => {
  /**
   * Render
   */
  return (
    <div className="Editor-code">
      <FreeFEMCode />
      <JsonCode />
    </div>
  )
}

export default Code
