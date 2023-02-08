import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import ReactAce from 'react-ace/lib/ace'
import CustomTooltip from '../tooltip'
import 'ace-builds/src-noconflict/theme-one_dark'
import './mode/mode-freefem-ejs'
import data from '../../doc/documentation.json'
import { EditorContext } from '@/context/editor'
import { setCursor, setTemplate } from '@/context/editor/actions'

/**
 * FreeFEM code
 */
const FreeFEMCode = (): JSX.Element => {
  // Ref
  const editorRef = useRef<ReactAce>()
  const currentToken = useRef<string>()
  const timeoutId = useRef<NodeJS.Timeout>()

  // State
  const [tooltipInfos, setTooltipInfos] = useState({
    x: 0,
    y: 0,
    display: false,
    currentFunction: {} as {
      name: string
      definition: string
      example: string
      params: string[]
      output: string[]
    }
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

    const editor = editorRef.current
    const textCoords = editor.editor.renderer.pixelToScreenCoordinates(
      event.clientX,
      event.clientY
    )

    const start = editor.editor.session.getWordRange(
      textCoords.row,
      textCoords.column
    ).start
    const position = editor.editor.renderer.textToScreenCoordinates(
      start.row,
      start.column
    )

    const token = editor.editor.session.getTokenAt(
      textCoords.row,
      textCoords.column
    )

    if (timeoutId.current && currentToken.current === token?.value) return
    else if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      setTooltipInfos((prev) => ({ ...prev, display: false }))
    }

    currentToken.current = token?.value

    timeoutId.current = setTimeout(() => {
      if (token && token.type === 'support.function') {
        let currentFunction =
          data['function'][token.value as keyof (typeof data)['function']]
        // Add JS condition
        setTooltipInfos({
          x: position.pageX,
          y: position.pageY + 16,
          display: true,
          currentFunction: { ...currentFunction, name: token.value }
        })
      }
    }, 100)
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

  console.log(data)

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
        theme="one_dark"
        mode="freefem-ejs"
        name="freefem_editor"
        value={template?.replace(/\t/g, '    ')}
        editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
        onCursorChange={onCursorChange}
        onChange={onChange}
        showPrintMargin={false}
      />

      {tooltipInfos.display && <CustomTooltip tooltipInfos={tooltipInfos} />}
    </>
  )
}
export default FreeFEMCode
