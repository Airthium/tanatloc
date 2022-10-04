import { useCallback, useContext } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-sqlserver'
import './mode/mode-freefem-ejs'

import { EditorContext } from '@/context/editor'
import { setCursor, setTemplate } from '@/context/editor/actions'

/**
 * FreeFEM code
 */
const FreeFEMCode = (): JSX.Element => {
  // Data
  const { template, dispatch } = useContext(EditorContext)

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback(
    (newCode?: string): void => {
      dispatch(setTemplate(newCode || ''))
    },
    [dispatch]
  )

  /**
   * On cursor change
   */
  const onCursorChange = useCallback(
    (selection: any): void => {
      dispatch(
        setCursor({
          row: selection.cursor.row,
          column: selection.cursor.column
        })
      )
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
      theme="sqlserver"
      mode="freefem-ejs"
      name="freefem_editor"
      value={template}
      editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
      onCursorChange={onCursorChange}
      onChange={onChange}
    />
  )
}

export default FreeFEMCode
