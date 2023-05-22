/** @module Components.Editor.Blobs.Solver */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Button, Checkbox, Form } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import {
  setTemplateCursor,
  setModel,
  setTemplateHighlight,
  setJsonHighlight,
  setJsonCursor
} from '@/context/editor/actions'

import { IModel } from '@/models/index.d'

import Dialog from '@/components/assets/dialog'
import { getHighlightPosition } from '@/components/utils/jsonPosition'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

/**
 * On add
 * @param values Values
 * @param template Template
 * @param model Model
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const _onAdd = (
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
  dispatch(
    setTemplateHighlight({
      begin: (cursor?.row ?? 0) + 1,
      end: (cursor?.row ?? 0) + 5
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 5, column: 0 }))

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
  const oldModel = JSON.stringify(modelJSON, null, '\t')
  const index = Object.keys(modelJSON.configuration ?? {}).length
  modelJSON.configuration = {
    ...(modelJSON.configuration ?? {}),
    parameters: {
      index: index + 1,
      title: 'Parameters',
      ...(modelJSON.configuration?.parameters ?? {}),
      solver: {
        advanced: true,
        label: 'Solver',
        ...((modelJSON.configuration?.parameters?.solver as object) ?? {}),
        children: [
          ...((modelJSON.configuration?.parameters?.solver as any)?.children ??
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
  const newModel = JSON.stringify(modelJSON, null, '\t')
  const highlight = getHighlightPosition(oldModel, newModel)
  dispatch(setJsonHighlight(highlight))
  dispatch(setJsonCursor({ row: highlight.end, column: 0 }))
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Solver
 * @returns Solver
 */
const Solver = (): React.JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, model, templateCursor, dispatch } =
    useContext(EditorContext)

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
    async (values: { solvers: string[] }): Promise<void> => {
      setLoading(true)

      _onAdd(values, template, model, templateCursor, dispatch)

      setLoading(false)
      setVisible(false)
    },
    [template, model, templateCursor, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Solver"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.Item name="solvers" label="Availables">
          <Checkbox.Group
            options={options}
            style={{ display: 'flex', flexDirection: 'column' }}
          />
        </Form.Item>
      </Dialog>
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Solver
      </Button>
    </>
  )
}

export default Solver
