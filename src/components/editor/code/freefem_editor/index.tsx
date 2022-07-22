import { useCallback, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-ejs'
import 'ace-builds/src-noconflict/theme-chrome'

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
      mode="ejs"
      name="freefem_editor"
      value={code}
      editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
      onChange={onChange}
    />
  )
}

export default FreeFEMCode
