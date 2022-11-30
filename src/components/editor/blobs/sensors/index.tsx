/** @module Components.Editor.Blobs.Sensors */

import { Dispatch, useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, InputRef } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor } from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

import { globalStyle } from '@/styles'

import { addOnCursor } from '..'

/**
 * On add
 * @param values Values
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const onAdd = (
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
  dispatch(setCursor({ row: (cursor?.row || 4) + 0, column: 0 }))
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
  const { template, cursor, dispatch } = useContext(EditorContext)

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Sensors"
        visible={visible}
        loading={loading}
        onOk={async (values) => {
          setLoading(true)

          onAdd(values, template, cursor, dispatch)

          setLoading(false)
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
      >
        <Form.Item
          label="X axis variable"
          name="x"
          rules={[{ required: true }]}
        >
          <Input ref={inputRef} />
        </Form.Item>
      </Dialog>
      <Button css={globalStyle.fullWidth} onClick={() => setVisible(true)}>
        Sensors
      </Button>
    </>
  )
}

export default Sensors
