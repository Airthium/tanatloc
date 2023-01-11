import { useCallback, useContext, useEffect, useRef, useState } from 'react'
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
  const editorRef = useRef(null)
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    display: false,
    text: ''
  })

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
   * On Mouse Move
   * @param event Mouse Event
   */

  const onMouseMove = (event: MouseEvent) => {
    if (editorRef.current) {
      const editor = editorRef.current as AceEditor
      const textCoords = editor.editor.renderer.pixelToScreenCoordinates(
        event.clientX,
        event.clientY
      )
      const token = editor.editor.session.getTokenAt(
        textCoords.row,
        textCoords.column
      )
      if (token && token.type === 'support.function') {
        setTooltipPosition({
          x: event.clientX,
          y: event.clientY,
          display: true,
          text: `Documentation for ${token.value}`
        })
      } else {
        setTooltipPosition((prevState) => ({ ...prevState, display: false }))
      }
    }
  }

  if (editorRef.current) {
    const editor = editorRef.current as AceEditor
    editor.editor.on('mousemove', onMouseMove)
  }
  /**
    
    On cursor change
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
    
    Render
    */
  return (
    <>
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
        ref={editorRef}
      />

      {tooltipPosition.display && (
        <div
          style={{
            position: 'absolute',
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            backgroundColor: 'white',
            padding: '5px',
            border: '1px solid gray'
          }}
        >
          {tooltipPosition.text}
        </div>
      )}
    </>
  )
}
export default FreeFEMCode
