import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import ReactAce from 'react-ace/lib/ace'
import 'ace-builds/src-noconflict/theme-sqlserver'
import './mode/mode-freefem-ejs'

import { EditorContext } from '@/context/editor'
import { setCursor, setTemplate } from '@/context/editor/actions'

// TODO
// - Stay 1 second on keyword to trigger tooltip
//      -> Look at debounce function, example in assets/formula
// - Find a way to split JS / FreeFEM
// - Find a way to make links to doc
//      -> Ok with storage.type, support.function, ... ?
// - Example of function in tooltip
// - Create JSON with custom descriptions
// - Display tooltip at the same position wherever function is hovered
// - Add dark mode

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
    text: '',
    link: <></>
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
    /* istanbul ignore next */
    if (!editorRef.current) return

    // setTimeout(() => {
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
      // Add JS condition
      setTooltipPosition({
        x: event.clientX - textCoords.offsetX, // Fixed position here
        y: event.clientY, // Fixed position here
        display: true,
        text: `Documentation for ${token.value} 
          Link to FreeFEM : `, // Use JSON data ?
        link: (
          <a
            href={'https://doc.freefem.org/documentation/' + token.value}
            target="_blank"
            rel="noreferrer"
          >
            https://doc.freefem.org/documentation/{token.value}
          </a>
        )
      })
    } else {
      setTooltipPosition((prevState) => ({ ...prevState, display: false }))
    }
    // }, 1000)
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
    if (!editorRef.current) return

    const editor = editorRef.current
    editor.editor.on('mousemove', onMouseMove) // Trigger ok, don't need to use another
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
        value={template?.replace(/\t/g, '    ')}
        editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
        onCursorChange={onCursorChange}
        onChange={onChange}
      />

      {tooltipPosition.display && (
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            backgroundColor: 'rgba(13, 17, 23, 0.75)',
            padding: '15px',
            border: '1px solid gray',
            color: '#fff',
            fontFamily: 'Saira',
            whiteSpace: 'pre-line',
            fontSize: '18px'
          }}
        >
          {tooltipPosition.text}
          {tooltipPosition.link}
        </div>
      )}
    </>
  )
}
export default FreeFEMCode
