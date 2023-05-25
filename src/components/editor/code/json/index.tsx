/** @module Components.Editor.Code.JSONEditor */

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Tooltip, Typography } from 'antd'
import AceEditor from 'react-ace'
import { Range } from 'ace-builds'
import ReactAce from 'react-ace/lib/ace'
import JSON5 from 'json5'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/theme-one_dark'

import { EditorContext, IEditorHighlight } from '@/context/editor'
import { setModel } from '@/context/editor/actions'
import JSONModel from './model.json'

import style from '../../index.module.css'
import Ajv from 'ajv'
import { WarningOutlined } from '@ant-design/icons'

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

  // State
  const [isError, setIsError] = useState<string>('')

  // Data
  const { model, jsonHighlight, dispatch } = useContext(EditorContext)

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback(
    (newCode?: string): void => {
      try {
        const ajv = new Ajv()
        const validate = ajv.compile(JSONModel)
        const valid = validate(JSON5.parse(newCode!))
        if (!valid) {
          setIsError(
            validate.errors?.[0].message +
              ' in "' +
              validate.errors?.[0].instancePath +
              '"'
          )
          editorRef.current?.editor.getSession().setAnnotations([
            {
              row: 0,
              column: 1,
              text: validate.errors?.[0].message ?? '',
              type: 'error'
            }
          ])
        } else {
          editorRef.current?.editor.getSession().setAnnotations([])
          setIsError('')
        }
      } catch (err) {
        const json5Error = err as JSON5Error
        setIsError(json5Error.message)
        const lineNumber = json5Error.lineNumber - 1
        const columnNumber = json5Error.columnNumber
        const annotations = [
          {
            row: lineNumber,
            column: columnNumber,
            text: json5Error.message,
            type: 'error'
          }
        ]
        editorRef.current?.editor.getSession().setAnnotations(annotations)
      }

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
      <Typography.Title level={3}>
        Model description{' '}
        {isError ? (
          <Tooltip title={isError}>
            <WarningOutlined
              style={{
                fontSize: '30px',
                zIndex: '1000',
                color: 'orange'
              }}
            />
          </Tooltip>
        ) : (
          ''
        )}
      </Typography.Title>
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
