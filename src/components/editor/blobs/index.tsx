import { Dispatch, useContext } from 'react'
import { Button, Collapse, Space } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor, setModel, setTemplate } from '@/context/editor/actions'

import { IModel } from '@/models/index.d'

/**
 * Add on cursor
 * @param template Template
 * @param text Text
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
const addOnCursor = (
  template: string,
  text: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!cursor) {
    dispatch(setTemplate((template || '') + text))
  } else {
    const row = cursor.row
    const rows = (template || '').split('\n')
    const newTemplate = [
      ...rows.slice(0, row + 1),
      ...text.split('\n'),
      ...rows.slice(row + 1)
    ]
    dispatch(setTemplate(newTemplate.join('\n')))
  }
}

/**
 * Add Header
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
const addHeader = (
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Headers -%>\n<%- helpers.indent(include('/blobs/headers.edp.ejs'), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 0) + 2, column: 0 }))
}

/**
 * Add Dimension
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
const addDimension = (
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Dimension -%>\n<%- helpers.indent(include('/blobs/dimensioning.edp.ejs', {\n\tdimension\n}), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 0) + 4, column: 0 }))
}

const addMesh = (
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    "<%# Mesh -%>\n<%\nconst mesh = geometry.mesh\nmesh.name = 'Mesh'\n-%>\n<%- helpers.indent(include('/blobs/mesh.edp.ejs', {\n\tdimension,\n\tmesh\n}), 1) -%>\n",
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 0) + 9, column: 0 }))

  // Model
  let modelJSON: Partial<IModel>
  try {
    modelJSON = JSON.parse(model)
  } catch (err) {
    modelJSON = {}
  }

  modelJSON.configuration = {
    ...(modelJSON.configuration || {}),
    geometry: {
      index: 1,
      title: 'Geometry',
      ...(modelJSON.configuration?.geometry || {}),
      meshable: true
    }
  }

  dispatch(setModel(JSON.stringify(modelJSON, null, '  ')))
}

/**
 * Blobs
 * @returns Blobs
 */
const Blobs = () => {
  // Data
  const { template, model, cursor, dispatch } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <Collapse style={{ overflow: 'auto', maxHeight: 'calc(100% - 443px)' }}>
      <Collapse.Panel key="head" header="Head">
        <Space direction="vertical" className="full-width">
          <Button
            className="full-width"
            onClick={() => addHeader(template, cursor, dispatch)}
          >
            Header
          </Button>
          <Button
            className="full-width"
            onClick={() => addDimension(template, cursor, dispatch)}
          >
            Dimension
          </Button>
        </Space>
      </Collapse.Panel>

      <Collapse.Panel key="components" header="Components">
        <Space direction="vertical" className="full-width">
          <Button
            className="full-width"
            onClick={() => addMesh(template, model, cursor, dispatch)}
          >
            Mesh
          </Button>
          <Button className="full-width">Materials</Button>
          <Button className="full-width">Finite element space</Button>
          <Button className="full-width">Finite element function</Button>
          <Button className="full-width">Macros</Button>
          <Button className="full-width">Solver</Button>
        </Space>
      </Collapse.Panel>

      <Collapse.Panel key="results" header="Results">
        <Space direction="vertical" className="full-width">
          <Button className="full-width">Save</Button>
          <Button className="full-width">Data</Button>
          <Button className="full-width">Coupling</Button>
          <Button className="full-width">Sensors</Button>
        </Space>
      </Collapse.Panel>
    </Collapse>
  )
}

export default Blobs
