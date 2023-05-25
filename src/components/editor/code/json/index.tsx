/** @module Components.Editor.Code.JSONEditor */

import { useCallback, useContext, useEffect, useRef } from 'react'
import { Typography } from 'antd'
import AceEditor from 'react-ace'
import { Range } from 'ace-builds'
import ReactAce from 'react-ace/lib/ace'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/theme-one_dark'

import { EditorContext, IEditorHighlight } from '@/context/editor'
import { setModel } from '@/context/editor/actions'

import style from '../../index.module.css'

// Local interface
export interface Marker {
  id: number
}

export interface JSON5Error extends Error {
  lineNumber: number
  columnNumber: number
}

/**
 * JSON code
 * @returns JSONCode
 */
const JSONCode = (): React.JSX.Element => {
  // Ref
  const editorRef = useRef<ReactAce>()

  // Data
  const { model, jsonHighlight, dispatch } = useContext(EditorContext)

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback(
    (newCode?: string): void => {
      dispatch(setModel(newCode ?? ''))
    },
    [dispatch]
  )

  /**
   * Highlight
   * @param highlight Highlight
   */
  const highlight = useCallback(({ begin, end }: IEditorHighlight): void => {
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

  // Highlight
  useEffect(() => {
    if (!jsonHighlight) return

    highlight(jsonHighlight)
  }, [jsonHighlight, highlight])

  /**
   * Render
   */
  return (
    <div className={style.codeBlock}>
      <Typography.Title level={3}>Model description</Typography.Title>
      <AceEditor
        //@ts-ignore
        ref={editorRef}
        width="100%"
        height="calc(100% - 32px)"
        fontSize={16}
        mode="json5"
        theme="one_dark"
        name="json_editor"
        value={model}
        editorProps={{ $blockScrolling: true }}
        onChange={onChange}
        showPrintMargin={false}
      />
    </div>
  )
}

export default JSONCode
