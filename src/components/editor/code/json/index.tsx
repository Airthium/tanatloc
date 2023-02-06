/** @module Components.Editor.Code.JSONEditor */

import { useCallback, useContext } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/theme-one_dark'

import { EditorContext } from '@/context/editor'
import { setModel } from '@/context/editor/actions'

/**
 * JSON code
 */
const JSONCode = (): JSX.Element => {
  // Data
  const { model, dispatch } = useContext(EditorContext)

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback(
    (newCode?: string): void => {
      dispatch(setModel(newCode || ''))
    },
    [dispatch]
  )

  /**
   * Render
   */
  return (
    <AceEditor
      width="100%"
      height="calc(100% - 64px)"
      fontSize={16}
      mode="json5"
      theme="one_dark"
      name="json_editor"
      value={model}
      editorProps={{ $blockScrolling: true }}
      onChange={onChange}
      showPrintMargin={false}
    />
  )
}

export default JSONCode
