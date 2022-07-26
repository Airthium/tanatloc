import React, { useCallback, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json5'
import 'ace-builds/src-noconflict/theme-sqlserver'

/**
 * IProps
 */
export interface IProps {
  model?: string
  setModel: (str?: string) => void
}

/**
 * Save delay
 */
const saveDelay = 1500

/**
 * JSON code
 */
const JSONCode = ({ model, setModel }: IProps): JSX.Element => {
  // State
  const [code, setCode] = useState<string>()
  const [updating, setUpdating] = useState<number>(0)

  // Model
  useEffect(() => {
    setCode(model)
  }, [model])

  /**
   * On change (delayed)
   * @param newCode New code
   */
  const onChangeDelayed = useCallback(
    (newCode?: string): void => {
      if (updating) clearTimeout(updating)
      const id = setTimeout(() => {
        setModel(newCode)
      }, saveDelay)
      setUpdating(+id)
    },
    [updating, setModel]
  )

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback(
    (newCode?: string): void => {
      setCode(newCode)

      onChangeDelayed(newCode)
    },
    [onChangeDelayed]
  )

  /**
   * Render
   */
  return (
    <AceEditor
      width="100%"
      height="calc(100% - 64px)"
      fontSize={16}
      mode="json5"
      theme="sqlserver"
      name="json_editor"
      value={code}
      editorProps={{ $blockScrolling: true }}
      onChange={onChange}
    />
  )
}

export default JSONCode
