import { useCallback, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-sqlserver'
import './mode/mode-freefem-ejs'

/**
 * IProps
 */
export interface IProps {
  template?: string
  setTemplate: (str?: string) => void
  setCursor: (cursor?: { row: number; column: number }) => void
}

/**
 * Save delay
 */
const saveDelay = 1500

/**
 * FreeFEM code
 */
const FreeFEMCode = ({
  template,
  setTemplate,
  setCursor
}: IProps): JSX.Element => {
  // State
  const [code, setCode] = useState<string>()
  const [updating, setUpdating] = useState<number>(0)

  // Template
  useEffect(() => {
    setCode(template)
  }, [template])

  /**
   * On change (delayed)
   * @param newCode New code
   */
  const onChangeDelayed = useCallback(
    (newCode?: string): void => {
      if (updating) clearTimeout(updating)
      const id = setTimeout(() => {
        setTemplate(newCode)
      }, saveDelay)
      setUpdating(+id)
    },
    [updating, setTemplate]
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
   * On cursor change
   */
  const onCursorChange = useCallback(
    (selection: any): void => {
      setCursor({
        row: selection.cursor.row,
        column: selection.cursor.column
      })
    },
    [setCursor]
  )

  /**
   * Render
   */
  return (
    <AceEditor
      width="100%"
      height="calc(100% - 64px)"
      fontSize={16}
      theme="sqlserver"
      mode="freefem-ejs"
      name="freefem_editor"
      value={code}
      editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
      onCursorChange={onCursorChange}
      onChange={onChange}
    />
  )
}

export default FreeFEMCode
