/** @module Components.Editor.Blobs.Sensors */

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Button, Form, Input, InputRef } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import {
  setTemplateCursor,
  setTemplateHighlight
} from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

/**
 * On add
 * @param values Values
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const _onAdd = (
  values: { x: string },
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    `<%# Sensors -%>
<%- helpers.indent(include('/blobs/sensors.edp.ejs', {
    path: run.dataPath,
    x: '${values.x}',
    sensors: run.sensors
}), 2) -%>`,
    cursor,
    dispatch
  )
  dispatch(
    setTemplateHighlight({
      begin: (cursor?.row || 0) + 1,
      end: (cursor?.row || 0) + 6
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row || 0) + 6, column: 0 }))
}

/**
 * Sensors
 * @returns Sensors
 */
const Sensors = (): JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, templateCursor, dispatch } = useContext(EditorContext)

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: { x: string }): Promise<void> => {
      setLoading(true)

      _onAdd(values, template, templateCursor, dispatch)

      setLoading(false)
      setVisible(false)
    },
    [template, templateCursor, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Sensors"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.Item
          label="X axis variable"
          name="x"
          rules={[{ required: true }]}
        >
          <Input ref={inputRef} />
        </Form.Item>
      </Dialog>
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Sensors
      </Button>
    </>
  )
}

export default Sensors
