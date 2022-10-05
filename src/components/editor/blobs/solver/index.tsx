import { Dispatch, useContext, useState } from 'react'
import { Button, Checkbox, Form } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor, setModel } from '@/context/editor/actions'

import { IModel } from '@/models/index.d'

import { addOnCursor } from '..'
import Dialog from '@/components/assets/dialog'

/**
 * On add
 * @param values Values
 * @param template Template
 * @param model Model
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
const onAdd = (
  values: { solvers: string[] },
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    `<%# Solver -%>
<% const solver = parameters.solver.children[0].value ?? parameters.solver.children[0].default -%>
<%- include('/blobs/solver.edp.ejs', {
    solver
}) -%>`,
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
      solver: {
        advanced: true,
        label: 'Solver',
        ...((modelJSON.configuration?.parameters?.solver as object) || {}),
        children: [
          ...((modelJSON.configuration?.parameters?.solver as any)?.children ||
            []),
          {
            label: 'System resolution',
            htmlEntity: 'select',
            options: values.solvers.map((solver) => ({
              label: solver,
              value: solver
            })),
            default: 'MUMPS'
          }
        ]
      }
    }
  }
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}
/**
 * Solver
 * @returns Solver
 */
const Solver = (): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, model, cursor, dispatch } = useContext(EditorContext)

  // Data
  const options = [
    'UMFPCK',
    'CG',
    'Cholesky',
    'Crout',
    'GMRES',
    'LU',
    'sparsesolver',
    'MUMPS'
  ]

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Solver"
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
        <Form.Item name="solvers" label="Availables">
          <Checkbox.Group
            options={options}
            style={{ display: 'flex', flexDirection: 'column' }}
          />
        </Form.Item>
      </Dialog>
      <Button className="full-width" onClick={() => setVisible(true)}>
        Solver
      </Button>
    </>
  )
}

export default Solver
