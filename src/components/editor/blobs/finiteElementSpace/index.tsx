/** @module Components.Editor.Blobs.FiniteElementSpace */

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Button, Form, Input, InputRef } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import { IModel } from '@/models/index.d'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor, setModel } from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

import { addOnCursor } from '..'

import { globalStyle } from '@/styles'

// Local interfaces
export interface ILocalValues {
  name: string
  options: { label: string; value: string; value2D: string }[]
}

/**
 * On add
 * @param values Values
 * @param template Template
 * @param model Model
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const _onAdd = (
  values: ILocalValues,
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!values.options) return
  if (!values.options.length) return

  // Template
  addOnCursor(
    template,
    `<%# Finite element space -%>
<%
const finiteElementSpace = parameters.finiteElementSpace.children[0]
finiteElementSpace.name = '${values.name}'
-%>
<%- include('/blobs/fespace.edp.ejs', {
  mesh,
  finiteElementSpace
}) -%>
`,
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 9) + 0, column: 0 }))

  // Model
  let modelJSON: Partial<
    Omit<IModel, 'configuration'> & {
      configuration: Partial<IModel['configuration']>
    }
  >
  try {
    modelJSON = JSON.parse(model)
  } catch (err) {
    modelJSON = {}
  }
  const index = Object.keys(modelJSON.configuration || {}).length
  modelJSON.configuration = {
    ...(modelJSON.configuration || {}),
    parameters: {
      index: index + 1,
      title: 'Parameters',
      ...(modelJSON.configuration?.parameters || {}),
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        ...((modelJSON.configuration?.parameters
          ?.finiteElementSpace as object) || {}),
        children: [
          ...((modelJSON.configuration?.parameters?.finiteElementSpace as any)
            ?.children || []),
          {
            label: 'Finite element space label',
            label2D: 'Finite element space label (2D)',
            htmlEntity: 'select',
            options: values.options,
            default: values.options[0].value,
            default2D: values.options[0].value2D
          }
        ]
      }
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Finite element space
 * @returns FiniteElementSpace
 */
const FiniteElementSpace = (): JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, model, cursor, dispatch } = useContext(EditorContext)

  // Autofocus
  useEffect(() => {
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

      _onAdd(values, template, model, cursor, dispatch)

      setLoading(false)
      setVisible(false)
    },
    [template, model, cursor, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Finite element space"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input ref={inputRef} />
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
                      Option {index + 1}
                    </div>
                  }
                >
                  <Form.Item
                    name={[field.name, 'label']}
                    label="Display name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="P1" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'value']}
                    label="Value"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="[P1, P1, P1]" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'value2D']}
                    label="Value 2D"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="[P1, P1]" />
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
      <Button css={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Finite element space
      </Button>
    </>
  )
}

export default FiniteElementSpace
