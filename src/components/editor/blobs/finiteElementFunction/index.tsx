/** @module Components.Editor.Blobs.FiniteElementFunction */

import { Dispatch, useContext, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, InputRef, Typography } from 'antd'

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
  values: {
    test1: string
    test2: string
    test3: string
    unknown1: string
    unknown2: string
    unknown3: string
  },
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    `<%# Finite element function -%>
<%
const testFunction = dimension === 2 ? '[${values.test1}, ${values.test2}]' : '[${values.test1}, ${values.test2}, ${values.test3}]'
const unknownFunction = dimension === 2 ? '[${values.unknown1}, ${values.unknown2}]' : '[${values.unknown1}, ${values.unknown2}, ${values.unknown3}]'
-%>
<%- include('/blobs/fespaceFunction.edp.ejs', {
    finiteElementSpace,
    finiteElementFunction: testFunction
  }) -%>
  <%- include('/blobs/fespaceFunction.edp.ejs', {
    finiteElementSpace,
    finiteElementFunction: unknownFunction
}) -%>
`,
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 9) + 0, column: 0 }))
}

/**
 * Finite element function
 * @returns FiniteElementFunction
 */
const FiniteElementFunction = (): JSX.Element => {
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
        title="Finite element function"
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
          label={<Typography.Text strong>Test function</Typography.Text>}
        >
          <Form.Item label="First coordinate" name="test1">
            <Input ref={inputRef} placeholder="Ux" />
          </Form.Item>
          <Form.Item label="Second coordinate" name="test2">
            <Input placeholder="Uy" />
          </Form.Item>
          <Form.Item label="Third coordinate" name="test3">
            <Input placeholder="Uz" />
          </Form.Item>
        </Form.Item>
        <Form.Item
          label={<Typography.Text strong>Unknows function</Typography.Text>}
        >
          <Form.Item label="First coordinate" name="unknown1">
            <Input placeholder="Uhx" />
          </Form.Item>
          <Form.Item label="Second coordinate" name="unknown2">
            <Input placeholder="Uhy" />
          </Form.Item>
          <Form.Item label="Third coordinate" name="unknown3">
            <Input placeholder="Uhz" />
          </Form.Item>
        </Form.Item>
      </Dialog>
      <Button css={globalStyle.fullWidth} onClick={() => setVisible(true)}>
        Finite element function
      </Button>
    </>
  )
}

export default FiniteElementFunction
