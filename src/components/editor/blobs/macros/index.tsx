/** @module Components.Editor.Blobs.Macros */

import { Dispatch, useContext, useState } from 'react'
import { Button, Checkbox, Form } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor } from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

import { addOnCursor } from '..'

/**
 * On add
 * @param values Values
 * @param template Tempalte
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const onAdd = (
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
  dispatch(setCursor({ row: (cursor?.row || 5) + 0, column: 0 }))
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
  const { template, cursor, dispatch } = useContext(EditorContext)

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
   * Render
   */
  return (
    <>
      <Dialog
        title="Macros"
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
        <Form.Item label="Type" name="macros">
          <Checkbox.Group
            options={options}
            style={{ display: 'flex', flexDirection: 'column' }}
          />
        </Form.Item>
      </Dialog>
      <Button className="full-width" onClick={() => setVisible(true)}>
        Macros
      </Button>
    </>
  )
}

export default Macros
