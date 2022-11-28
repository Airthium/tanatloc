/** @module Components.Editor.Blobs.Data */

import { Dispatch, useContext, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

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
const onAdd = (
  values: { x: string; datas: { name: string; y: string }[] },
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
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, cursor, dispatch } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Data"
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
          <Input />
        </Form.Item>
        <Form.List name="datas">
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  key={field.key}
                  label={
                    <div>
                      <MinusCircleOutlined
                        style={{
                          fontSize: '16px',
                          color: 'red',
                          marginRight: '10px'
                        }}
                        onClick={() => remove(field.name)}
                      />
                      Data {index + 1}
                    </div>
                  }
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
                </Form.Item>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: '60%' }}
                  icon={<PlusOutlined />}
                >
                  Add data
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Dialog>
      <Button css={globalStyle.fullWidth} onClick={() => setVisible(true)}>
        Data
      </Button>
    </>
  )
}

export default Data
