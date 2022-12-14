/** @module Components.Editor.Blobs.Data */

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
import { setCursor } from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'
import { FormListContainer, FormListItem } from '@/components/assets/form'

import { addOnCursor } from '..'

import { globalStyle } from '@/styles'

/**
 * On add
 * @param values Values
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const _onAdd = (
  values: { title: string; x: string; datas: { name: string; y: string }[] },
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!values.datas) return
  if (!values.datas.length) return

  // Template
  addOnCursor(
    template,
    `<%- include('/blobs/data.edp.ejs', {
    title: '${values.title}',
    path: run.dataPath,
    fileName: '"iter_"+timeIter',
    dataNames: [${values.datas.map((data) => `'${data.name}'`).join(', ')}],
    x: '${values.x}',
    ys: [${values.datas.map((data) => `'${data.y}'`).join(', ')}]
}) -%>`,
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 4) + 0, column: 0 }))
}

/**
 * Data
 * @returns Data
 */
const Data = (): JSX.Element => {
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
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: any): Promise<void> => {
      setLoading(true)

      _onAdd(values, template, cursor, dispatch)

      setLoading(false)
      setVisible(false)
    },
    [template, cursor, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Data"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.Item label="Title" name="title" rules={[{ required: true }]}>
          <Input ref={inputRef} />
        </Form.Item>
        <Form.Item
          label="X axis variable"
          name="x"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.List name="datas">
          {(fields, { add, remove }, { errors }) => (
            <FormListContainer label="data" add={add} errors={errors}>
              {fields.map((field, index) => (
                <FormListItem
                  key={index}
                  label="Data"
                  field={field}
                  index={index}
                  remove={remove}
                >
                  <Form.Item
                    name={[field.name, 'name']}
                    label="Display name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'y']}
                    label="Y axis variable"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                </FormListItem>
              ))}
            </FormListContainer>
          )}
        </Form.List>
      </Dialog>
      <Button css={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Data
      </Button>
    </>
  )
}

export default Data
