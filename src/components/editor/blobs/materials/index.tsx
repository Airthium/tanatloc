/** @module Components.Editor.Blobs.Materials */

import { Dispatch, useContext, useState } from 'react'
import { Button, Form, Input, Select } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import { IModel } from '@/models/index.d'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor, setModel } from '@/context/editor/actions'

import { availableSymbols } from '@/config/materials'

import Dialog from '@/components/assets/dialog'

import { addOnCursor } from '..'

/**
 * On add
 * @param values Values
 * @param template Template
 * @param model Model
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const onAdd = (
  values: { materials: { symbol: number; default: string }[] },
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!values.materials) return
  if (!values.materials.length) return

  const materials = values.materials.map(
    (material: { symbol: number; default: string }) => {
      const symbol = availableSymbols[material.symbol]
      const label = symbol.label
      const name = symbol.symbol
      const unit = symbol.unit
      return { label, name, default: material.default, unit }
    }
  )

  // Template
  if (!template.includes("include('/blobs/materials.edp.ejs'")) {
    addOnCursor(
      template,
      `<%# Material -%>
<%- include('/blobs/materials.edp.ejs', {
  materials
}) -%>
`,
      cursor,
      dispatch
    )
    dispatch(setCursor({ row: (cursor?.row || 4) + 0, column: 0 }))
  }

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
    materials: {
      index: index + 1,
      title: 'Materials',
      ...(modelJSON.configuration?.materials || {}),
      children: [
        ...(modelJSON.configuration?.materials?.children || []),
        ...materials.map((material) => ({
          label: material.label,
          name: material.name,
          htmlEntity: 'formula',
          default: +material.default,
          unit: material.unit
        }))
      ]
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Materials
 * @returns Materials
 */
const Materials = (): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, model, cursor, dispatch } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Materials"
        visible={visible}
        loading={loading}
        onOk={async (values) => {
          setLoading(true)

          onAdd(values, template, model, cursor, dispatch)

          setLoading(false)
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
      >
        <Form.List name="materials">
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
                      Material {index + 1}
                    </div>
                  }
                >
                  <Form.Item
                    name={[field.name, 'symbol']}
                    label="Physical parameter"
                    rules={[{ required: true }]}
                  >
                    <Select
                      options={availableSymbols.map((symbol, sindex) => ({
                        label: symbol.symbol + ': ' + symbol.label,
                        value: sindex
                      }))}
                    />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'default']}
                    label="Default"
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
                  Add material
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Dialog>
      <Button className="full-width" onClick={() => setVisible(true)}>
        Materials
      </Button>
    </>
  )
}

export default Materials
