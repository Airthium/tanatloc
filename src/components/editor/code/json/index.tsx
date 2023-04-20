/** @module Components.Editor.Code.JSONEditor */

import { useCallback, useContext } from 'react'
import { Typography } from 'antd'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/theme-one_dark'

import { EditorContext } from '@/context/editor'
import { setModel } from '@/context/editor/actions'

import style from '../../index.module.css'

/**
 * JSON code
 * @returns JSONCode
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
    <div className={style.codeBlock}>
      <Typography.Title level={3}>Model description</Typography.Title>
      <AceEditor
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
