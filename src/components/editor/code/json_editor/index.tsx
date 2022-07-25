import React, { useCallback, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/theme-sqlserver'

export interface IProps {
  model?: string
}

/**
 * JSON code
 */
const JSONCode = ({ model }: IProps): JSX.Element => {
  // State
  const [code, setCode] = useState<string>()

  // Model
  useEffect(() => {
    setCode(model)
  }, [model])

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback((newCode: string): void => {
    setCode(newCode)
  }, [])

  /**
   * Render
   */
  return (
    <AceEditor
      width="100%"
      height="calc(100% - 64px)"
      fontSize={16}
      mode="json5"
      theme="chrome"
      name="json_editor"
      value={code}
      editorProps={{ $blockScrolling: true }}
      onChange={onChange}
    />
  )
}

export default JSONCode
