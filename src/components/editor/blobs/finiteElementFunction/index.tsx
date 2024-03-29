/** @module Components.Editor.Blobs.FiniteElementFunction */

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Button, Form, Input, InputRef, Typography } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import {
  setTemplateCursor,
  setTemplateHighlight
} from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

// Local interfaces
export interface ILocalValues {
  test1: string
  test2: string
  test3: string
  unknown1: string
  unknown2: string
  unknown3: string
}

/**
 * On add
 * @param values Values
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const _onAdd = (
  values: ILocalValues,
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
  dispatch(
    setTemplateHighlight({
      begin: cursor?.row ?? 0,
      end: (cursor?.row ?? 0) + 13
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 13, column: 0 }))
}

/**
 * Finite element function
 * @returns FiniteElementFunction
 */
const FiniteElementFunction: React.FunctionComponent = () => {
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
    async (values: ILocalValues): Promise<void> => {
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
        title="Finite element function"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
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
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Finite element function
      </Button>
    </>
  )
}

export default FiniteElementFunction
