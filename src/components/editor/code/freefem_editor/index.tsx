import { useCallback, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-sqlserver'
import './mode/mode-freefem-ejs'

export interface IProps {
  template?: string
}

/**
 * FreeFEM code
 */
const FreeFEMCode = ({ template }: IProps): JSX.Element => {
  // State
  const [code, setCode] = useState<string>()

  // Template
  useEffect(() => {
    setCode(template)
  }, [template])

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
      theme="chrome"
      mode="freefem-ejs"
      name="freefem_editor"
      value={code}
      editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
      onChange={onChange}
    />
  )
}

export default FreeFEMCode
