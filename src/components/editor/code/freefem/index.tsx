import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import ReactAce from 'react-ace/lib/ace'
import CustomTooltip from '../tooltip'
import 'ace-builds/src-noconflict/theme-one_dark'
import './mode/mode-freefem-ejs'
import data from '../../doc/documentation.json'
import { EditorContext } from '@/context/editor'
import { setCursor, setTemplate } from '@/context/editor/actions'
import { setCompleters } from 'ace-builds/src-noconflict/ext-language_tools'
import allSnippets from "./snippets/snippets.json"
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
    currentToken: {} as {
      name: string
      definition: string
      example: string
      params?: string[]
      output?: string[]
      docReference?: string
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

    // Get event position
    const editor = editorRef.current
    const textCoords = editor.editor.renderer.pixelToScreenCoordinates(
      event.clientX,
      event.clientY
    )

    // Get token position infos
    const start = editor.editor.session.getWordRange(
      textCoords.row,
      textCoords.column
    ).start
    const position = editor.editor.renderer.textToScreenCoordinates(
      start.row,
      start.column
    )

    // Get token data
    const token = editor.editor.session.getTokenAt(
      textCoords.row,
      textCoords.column
    )

    // Hover for a custom time to trigger tooltip
    if (timeoutId.current && currentToken.current === token?.value) return
    else if (timeoutId.current) {
      clearTimeout(timeoutId.current)
      setTooltipInfos((prev) => ({ ...prev, display: false }))
    }

    currentToken.current = token?.value

    timeoutId.current = setTimeout(() => {
      if (
        (token && token.type === 'support.function') ||
        (token && token.type === 'storage.type') // Need better switch case
      ) {
        let currentTokenInfos =
          token.type === 'support.function'
            ? data['function'][token.value as keyof (typeof data)['function']]
            : data['type'][token.value as keyof (typeof data)['type']] // Need better switch case
        setTooltipInfos({
          x: position.pageX,
          y: position.pageY + 16,
          display: true,
          currentToken: { ...currentTokenInfos, name: token.value }
        })
      }
    }, 500)
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
    editor.editor.on('mousemove', onMouseMove)
  }, [onMouseMove])

  useEffect(() => {
    const completer = {
      getCompletions: function (
        _editor: any,
        _session: any,
        _pos: any,
        _prefix: any,
        callback: any
      ) {
        callback(null, allSnippets)
      }
    }

    setCompleters([completer])
  }, [])

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
        enableSnippets={true}
        enableBasicAutocompletion={true}
        enableLiveAutocompletion={true}
      />

      {tooltipInfos.display && <CustomTooltip tooltipInfos={tooltipInfos} />}
    </>
  )
}
export default FreeFEMCode
