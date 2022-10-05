/** @module Components.Editor.Blobs.Save */

import { Dispatch, useContext, useState } from 'react'
import { Button, Form, Input } from 'antd'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

import { IModel } from '@/models/index.d'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor, setModel } from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

import { addOnCursor } from '..'

/**
 * Get in template
 * @param values Values
 * @returns Results, Order
 */
const getInTemplate = (values: {
  scalarResults?: { name: string; variable: string }[]
  vectorialResults?: {
    name: string
    variable1: string
    variable2: string
    variable3: string
  }[]
}): { results: string; order: string } => {
  const scalarResults = values.scalarResults
    ?.map((result) => `'${result.variable}'`)
    ?.join(', ')
  const vectorialResults = values.vectorialResults
    ?.map(
      (result) =>
        `dimension === 2 ? ['${result.variable1}', '${result.variable2}', '0'] : ['${result.variable1}', '${result.variable2}', '${result.variable3}']`
    )
    ?.join(', ')
  const results =
    (scalarResults ? scalarResults + ', ' : '') + (vectorialResults ?? '')

  const scalarOrder = values.scalarResults?.map((_) => 1)?.join(', ')
  const vectorialOrder = values.vectorialResults?.map((_) => 1)?.join(', ')
  const order = (scalarOrder ? scalarOrder + ', ' : '') + (vectorialOrder ?? '')

  return { results, order }
}

/**
 * On add
 * @param values Values
 * @param template Template
 * @param model Model
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const onAdd = (
  values: {
    scalarResults?: { name: string; variable: string }[]
    vectorialResults?: {
      name: string
      variable1: string
      variable2: string
      variable3: string
    }[]
  },
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!values.scalarResults && !values.vectorialResults) return
  if (!values.scalarResults?.length && !values.vectorialResults?.length) return

  // Template
  const inTemplate = getInTemplate(values)
  addOnCursor(
    template,
    `<%# Save -%>
<%- include('/blobs/save.edp.ejs', {
    solution: {
        path: run.resultPath,
        name: '"Result"',
        mesh: mesh.name,
        sol: [${inTemplate.results}],
        dataName: run.results.map(r => r.name),
        order: [${inTemplate.order}]
    }
}) -%>
`,
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 4) + 0, column: 0 }))

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
    run: {
      index: index + 1,
      title: 'Run',
      ...(modelJSON.configuration?.run ?? {}),
      results: [
        ...(modelJSON.configuration?.run?.results || []),
        ...(values.scalarResults?.map((result) => ({ name: result.name })) ||
          []),
        ...(values.vectorialResults?.map((result) => ({ name: result.name })) ||
          [])
      ]
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Save
 * @returns Save
 */
const Save = (): JSX.Element => {
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
        title="Save"
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
        <Form.List name="scalarResults">
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
                      Scalar result {index + 1}
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
                    name={[field.name, 'variable']}
                    label="Variable name"
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
                  Add scalar result
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List name="vectorialResults">
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
                      Vectorial result {index + 1}
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
                    name={[field.name, 'variable1']}
                    label="First component variable name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'variable2']}
                    label="Second component variable name"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'variable3']}
                    label="Third component variable name"
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
                  Add vectorial result
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Dialog>
      <Button className="full-width" onClick={() => setVisible(true)}>
        Save
      </Button>
    </>
  )
}

export default Save
