/** @module Components.Editor.Blobs.Save */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Button, Form, Input } from 'antd'

import { IModel } from '@/models/index.d'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import {
  setTemplateCursor,
  setModel,
  setTemplateHighlight,
  setJsonHighlight,
  setJsonCursor
} from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'
import { FormListContainer, FormListItem } from '@/components/assets/form'
import { getHighlightPosition } from '@/components/utils/jsonPosition'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

// Local interfaces
export interface ILocalValues {
  scalarResults?: { name: string; variable: string }[]
  vectorialResults?: {
    name: string
    variable1: string
    variable2: string
    variable3: string
  }[]
}

/**
 * Get in template
 * @param values Values
 * @returns Results, Order
 */
export const _getInTemplate = (values: {
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
export const _onAdd = (
  values: ILocalValues,
  template: string,
  model: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  if (!values.scalarResults && !values.vectorialResults) return
  if (!values.scalarResults?.length && !values.vectorialResults?.length) return

  // Template
  const inTemplate = _getInTemplate(values)
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
  dispatch(
    setTemplateHighlight({
      begin: (cursor?.row ?? 0) + 1,
      end: (cursor?.row ?? 0) + 11
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 11, column: 0 }))

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
    run: {
      index: index + 1,
      title: 'Run',
      ...(modelJSON.configuration?.run ?? {}),
      //@ts-ignore
      results: [
        ...(modelJSON.configuration?.run?.results ?? []),
        ...(values.scalarResults?.map((result) => ({ name: result.name })) ??
          []),
        ...(values.vectorialResults?.map((result) => ({ name: result.name })) ??
          [])
      ]
    }
  }
  const newModel = JSON.stringify(modelJSON, null, '\t')
  const highlight = getHighlightPosition(oldModel, newModel)
  dispatch(setJsonHighlight(highlight))
  dispatch(setJsonCursor({ row: highlight.end, column: 0 }))
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Save
 * @returns Save
 */
const Save = (): React.JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, model, templateCursor, dispatch } =
    useContext(EditorContext)

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
        title="Save"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.List name="scalarResults">
          {(fields, { add, remove }, { errors }) => (
            <FormListContainer label="scalar result" add={add} errors={errors}>
              {fields.map((field, index) => (
                <FormListItem
                  key={field.key}
                  label="Scalar result"
                  field={field}
                  index={index}
                  remove={remove}
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
                </FormListItem>
              ))}
            </FormListContainer>
          )}
        </Form.List>
        <Form.List name="vectorialResults">
          {(fields, { add, remove }, { errors }) => (
            <FormListContainer
              label="vectorial result"
              add={add}
              errors={errors}
            >
              {fields.map((field, index) => (
                <FormListItem
                  key={field.key}
                  label="Vectorial result"
                  field={field}
                  index={index}
                  remove={remove}
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
                </FormListItem>
              ))}
            </FormListContainer>
          )}
        </Form.List>
      </Dialog>
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Save
      </Button>
    </>
  )
}

export default Save
