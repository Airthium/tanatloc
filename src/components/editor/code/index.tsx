import React from 'react'
import FreeFEMCode from './freefem_editor'
import JsonCode from './json_editor'

export interface IProps {
  model?: string
  template?: string
}

/**
 * Code
 */
const Code = ({ model, template }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <div className="Editor-code">
      <FreeFEMCode template={template} />
      <JsonCode model={model} />
    </div>
  )
}

export default Code
