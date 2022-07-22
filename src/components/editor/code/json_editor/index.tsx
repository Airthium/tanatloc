import React from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'

/**
 * JSON code
 */
const JSONCode = () => {
  /**
   * Render
   */
  return (
    <AceEditor
      width="100%"
      height="100%"
      mode="json"
      theme="github"
      name="json_editor"
      value={'bla'}
      editorProps={{ $blockScrolling: true }}
    />
  )
}

export default JSONCode
