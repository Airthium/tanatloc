import { useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-github'

/**
 * FreeFEM code
 */
const FreeFEMCode = () => {
  // State
  const [code, setCode] = useState('FreeFem Editor')

  /**
   * On change
   * @param newCode New code
   */
  const onChange = (newCode: string): void => {
    setCode(newCode)
  }

  /**
   * Render
   */
  return (
    <AceEditor
      width="100%"
      height="100%"
      theme="github"
      mode="freefem"
      name="freefem_editor"
      value={code}
      editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
      onChange={onChange}
    />
  )
}

export default FreeFEMCode
