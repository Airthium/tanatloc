/** @module Components.Editor.Blobs.Mesh */

import { Dispatch, useContext, useState } from 'react'
import { Button, Form, Input } from 'antd'

import { IModel } from '@/models/index.d'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor, setModel } from '@/context/editor/actions'

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
  values: { name: string },
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  if (!template.includes("include('/blobs/mesh.edp.ejs'")) {
    addOnCursor(
      template,
      `<%# Mesh -%>
<%
const mesh = geometry.mesh
mesh.name = '${values.name}'
-%>
<%- include('/blobs/mesh.edp.ejs', {
  dimension,
  mesh
}) -%>
`,
      cursor,
      dispatch
    )
    dispatch(setCursor({ row: (cursor?.row || 0) + 9, column: 0 }))
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
    geometry: {
      index: index + 1,
      title: 'Geometry',
      mesh: {
        name: values.name
      },
      ...(modelJSON.configuration?.geometry || {}),
      meshable: true
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Mesh
 * @returns Mesh
 */
const Mesh = (): JSX.Element => {
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
        title="Mesh"
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
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Dialog>
      <Button className="full-width" onClick={() => setVisible(true)}>
        Mesh
      </Button>
    </>
  )
}

export default Mesh
