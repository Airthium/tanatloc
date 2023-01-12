import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import ReactAce from 'react-ace/lib/ace'
import 'ace-builds/src-noconflict/theme-sqlserver'
import './mode/mode-freefem-ejs'

import { EditorContext } from '@/context/editor'
import { setCursor, setTemplate } from '@/context/editor/actions'

/**
 * FreeFEM code
 */
const FreeFEMCode = (): JSX.Element => {
  // Ref
  const editorRef = useRef<ReactAce>()

  // State
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    display: false,
    text: ''
  })

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
   * On Mouse Move
   * @param event Mouse Event
   */
  const onMouseMove = useCallback((event: MouseEvent) => {
    if (editorRef.current) {
      const editor = editorRef.current
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
  }, [])

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

  // Init
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current
      editor.editor.on('mousemove', onMouseMove)
    }
  }, [onMouseMove])

  /**
   * Render
   */
  return (
    <>
      <AceEditor
        //@ts-ignore
        ref={editorRef}
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
