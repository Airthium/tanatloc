import React from 'react'
import FreeFEMCode from './freefem_editor'
import JsonCode from './json_editor'

export interface IProps {
  model?: string
  template?: string
  setModel: (str?: string) => void
  setTemplate: (str?: string) => void
  setTemplateCursor: (cursor?: { row: number; column: number }) => void
}

/**
 * Code
 */
const Code = ({
  model,
  template,
  setModel,
  setTemplate,
  setTemplateCursor
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <div className="Editor-code">
      <FreeFEMCode
        template={template}
        setTemplate={setTemplate}
        setCursor={setTemplateCursor}
      />
      <JsonCode model={model} setModel={setModel} />
    </div>
  )
}

export default Code
