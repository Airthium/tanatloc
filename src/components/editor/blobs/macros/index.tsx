/** @module Components.Editor.Blobs.Macros */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Button, Checkbox, Form } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import {
  setTemplateCursor,
  setTemplateHighlight
} from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

/**
 * On add
 * @param values Values
 * @param template Tempalte
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const _onAdd = (
  values: { macros: string[] },
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  const inTemplateMacros = values.macros
    .map((macro) => "'" + macro + "'")
    .join(', ')

  // Template
  addOnCursor(
    template,
    `<%# Macro -%>
<%- include('/blobs/macro.edp.ejs', {
    dimension,
    type: [${inTemplateMacros}]
}) -%>
`,
    cursor,
    dispatch
  )
  dispatch(
    setTemplateHighlight({
      begin: (cursor?.row || 0) + 1,
      end: (cursor?.row || 0) + 5
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row || 0) + 5, column: 0 }))
}

/**
 * Macros
 * @returns Macros
 */
const Macros = (): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, templateCursor, dispatch } = useContext(EditorContext)

  // Data
  const options = [
    { label: 'Scalar gradient', value: 'scalarGradient' },
    { label: 'Vectorial divergence', value: 'vectorialDivergence' },
    {
      label: 'Vectorial divergence axisymmetric',
      value: 'vectorialDivergenceRZ'
    },
    { label: 'Vectorial epsilon', value: 'vectorialEpsilon' },
    { label: 'Vectorial gradient', value: 'vectorialGradient' },
    {
      label: 'Vectorial R divergence axisymmetric',
      value: 'vectorialRdivergenceRZ'
    }
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
    async (values: { macros: string[] }): Promise<void> => {
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
        title="Macros"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.Item label="Type" name="macros">
          <Checkbox.Group
            options={options}
            style={{ display: 'flex', flexDirection: 'column' }}
          />
        </Form.Item>
      </Dialog>
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Macros
      </Button>
    </>
  )
}

export default Macros
