/** @module Components.Editor.Code.FreeFEM */

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Typography, Input, Button } from 'antd'
import AceEditor from 'react-ace'
import { Range } from 'ace-builds'
import ReactAce from 'react-ace/lib/ace'
import { setCompleters } from 'ace-builds/src-noconflict/ext-language_tools'

import 'ace-builds/src-noconflict/theme-one_dark'
import './mode/mode-freefem-ejs'

import { EditorContext, IEditorHighlight } from '@/context/editor'
import { setTemplateCursor, setTemplate } from '@/context/editor/actions'

import allSnippets from './snippets/snippets.json'
import data from './doc/documentation.json'
import CustomTooltip from './tooltip'

import style from '../../index.module.css'

/**
 * Token
 */
export interface IToken {
  name: string
  definition: string
  example: string
  params?: string[]
  output?: string[]
  docReference?: string
}

/**
 * Position
 */
export interface IPosition {
  x: number
  y: number
}

export interface Marker {
  id: number
}

/**
 * FreeFEM code
 * @returns FreeFEMCode
 */
const FreeFEMCode = (): React.JSX.Element => {
  // Ref
  const editorRef = useRef<ReactAce>()
  const cursorFromContext = useRef<boolean>()
  const currentToken = useRef<string>()
  const timeoutId = useRef<NodeJS.Timeout>()

  // State
  const [tooltipPosition, setTooltipPosition] = useState<IPosition>({
    x: 0,
    y: 0
  })
  const [tooltipToken, setTooltipToken] = useState<IToken>()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [totalOccurrences, setTotalOccurrences] = useState<number>(0)
  const [currentOccurrence, setCurrentOccurrence] = useState<number>(0)
  const [isSearchVisible, setIsSearchVisible] = useState<boolean>(false)

  // Data
  const { template, templateCursor, templateHighlight, dispatch } =
    useContext(EditorContext)

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback(
    (newCode?: string): void => {
      dispatch(setTemplate(newCode ?? ''))
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
    const { left } = editor.editor.container.getBoundingClientRect()
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
      setTooltipToken(undefined)
    }
    currentToken.current = token?.value

    timeoutId.current = setTimeout(() => {
      if (!token) return

      const currentToken =
        token.type === 'support.function'
          ? data['function'][token.value as keyof (typeof data)['function']]
          : data['type'][token.value as keyof (typeof data)['type']]

      if (currentToken) {
        setTooltipPosition({ x: position.pageX + left, y: position.pageY })
        setTooltipToken({
          ...currentToken,
          name: token.value
        })
      }
    }, 500)
  }, [])

  /**
   * On cursor change
   */
  const onCursorChange = useCallback(
    (selection: any): void => {
      if (!cursorFromContext.current)
        dispatch(
          setTemplateCursor({
            row: selection.cursor.row,
            column: selection.cursor.column
          })
        )
    },
    [dispatch]
  )

  /**
   * Highlight
   * @param highlight Highlight
   */
  const highlight = useCallback(({ begin, end }: IEditorHighlight): void => {
    /* istanbul ignore next */
    if (!editorRef.current) return

    const editor = editorRef.current.editor

    const markers: Marker[] = []
    for (let i = begin; i <= end; i++) {
      const id = editor.session.addMarker(
        new Range(i, 0, i, Infinity),
        'ace_pasted_line',
        'fullLine'
      )
      markers.push({ id: id })
    }

    setTimeout(() => {
      markers.forEach((marker) => editor.session.removeMarker(marker.id))
    }, 2_500)
  }, [])

  /**
   * Handle paste
   * @param event Event
   */
  const handlePaste = useCallback(
    (event: any): void => {
      /* istanbul ignore next */
      if (!editorRef.current) return

      const editor = editorRef.current.editor

      // Row position
      const { row } = editor.getCursorPosition()

      // Data
      const clipboardData = event.clipboardData
      const pastedData = clipboardData.getData('Text')
      const pastedLines = pastedData.split('\n').length

      highlight({ begin: row - (pastedLines - 1), end: row })
    },
    [highlight]
  )

  // const handleSearch = useCallback(() => {
  //   /* istanbul ignore next */
  //   if (!editorRef.current) return

  //   const editor = editorRef.current.editor

  //   editor.find(searchTerm, {
  //     backwards: false,
  //     wrap: false,
  //     caseSensitive: false,
  //     wholeWord: false,
  //     regExp: false
  //   })
  // }, [searchTerm])

  const handleSearch = useCallback(() => {
    if (!editorRef.current || !searchTerm) {
      setTotalOccurrences(0)
      setCurrentOccurrence(0)
      return
    }

    const editor = editorRef.current.editor

    let results = editor.findAll(searchTerm, {
      backwards: false,
      wrap: true,
      caseSensitive: false,
      wholeWord: false,
      regExp: false
    })

    setTotalOccurrences(results)

    if (results > 0) {
      setCurrentOccurrence(1)
      editor.find(searchTerm, {
        backwards: false,
        wrap: false,
        caseSensitive: false,
        wholeWord: false,
        regExp: false
      })
    }
  }, [searchTerm])

  const handleNext = useCallback(() => {
    if (
      !editorRef.current ||
      !searchTerm ||
      currentOccurrence >= totalOccurrences
    )
      return

    const editor = editorRef.current.editor

    editor.findNext()
    setCurrentOccurrence(currentOccurrence + 1)
  }, [searchTerm, currentOccurrence, totalOccurrences])

  const handlePrevious = useCallback(() => {
    if (!editorRef.current || !searchTerm || currentOccurrence <= 1) return

    const editor = editorRef.current.editor

    editor.findPrevious()
    setCurrentOccurrence(currentOccurrence - 1)
  }, [searchTerm, currentOccurrence])

  // Init
  useEffect(() => {
    if (!editorRef.current) return

    const editor = editorRef.current
    editor.editor.container.classList.add('pasted_line_container')
    editor.editor.commands.addCommand({
      name: 'showSearch',
      bindKey: { win: 'Ctrl-F', mac: 'Command-F' },
      exec: () => {
        setIsSearchVisible((prev) => !prev)
      }
    })
    editor.editor.on('mousemove', onMouseMove)
  }, [onMouseMove])

  // Completer
  useEffect(() => {
    const completer = {
      getCompletions: (
        _editor: any,
        _session: any,
        _pos: any,
        _prefix: any,
        callback: any
      ) => {
        callback(null, allSnippets)
      }
    }
    setCompleters([completer])
  }, [])

  // Cursor
  useEffect(() => {
    /* istanbul ignore next */
    if (!editorRef.current) return

    if (!templateCursor) return

    cursorFromContext.current = true

    const editor = editorRef.current.editor
    editor.moveCursorTo(templateCursor.row, templateCursor.column)

    setTimeout(() => (cursorFromContext.current = false), 500)
  }, [templateCursor])

  // Highlight
  useEffect(() => {
    if (!templateHighlight) return

    highlight(templateHighlight)
  }, [templateHighlight, highlight])

  // Event
  useEffect(() => {
    const editor = editorRef.current?.editor
    if (editor) {
      editor.container.addEventListener('paste', handlePaste)
    }

    return () => {
      if (editor) {
        editor.container.removeEventListener('paste', handlePaste)
      }
    }
  }, [handlePaste])

  /**
   * Render
   */
  return (
    <div className={style.codeBlock}>
      <Typography.Title level={3}>FreeFEM template</Typography.Title>
      <div style={{ position: 'relative' }}>
        {isSearchVisible && (
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              zIndex: 10,
              backgroundColor: '#333',
              padding: '5px',
              borderRadius: '5px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              style={{
                height: '30px',
                borderRadius: '5px',
                backgroundColor: '#ccc',
                border: 'none'
              }}
            />
            <Button
              onClick={handleSearch}
              style={{
                marginLeft: '5px',
                backgroundColor: '#ccc',
                border: 'none'
              }}
            >
              Search
            </Button>

            <Button onClick={handlePrevious} style={{ marginRight: '5px' }}>
              Previous
            </Button>
            <Button onClick={handleNext} style={{ marginRight: '5px' }}>
              Next
            </Button>
            <Typography.Text
              style={{ color: 'white', marginRight: '10px', width: '150px' }}
            >
              Nb :{currentOccurrence}/{totalOccurrences}
            </Typography.Text>
          </div>
        )}
      </div>
      <AceEditor
        //@ts-ignore
        ref={editorRef}
        className="ace_editor"
        width="100%"
        height="calc(100% - 32px)"
        fontSize={16}
        theme="one_dark"
        mode="freefem-ejs"
        name="freefem_editor"
        value={template?.replace(/\t/g, '    ')}
        editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
        onCursorChange={onCursorChange}
        onChange={onChange}
        showPrintMargin={false}
        style={style}
      />
      <CustomTooltip
        x={tooltipPosition.x}
        y={tooltipPosition.y}
        token={tooltipToken}
      />
    </div>
  )
}
export default FreeFEMCode
