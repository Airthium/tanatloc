/** @module Components.Editor.Blobs.Materials */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Button, Form, Input, Select } from 'antd'

import { IModel } from '@/models/index.d'

import { availableSymbols } from '@/config/materials'

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
import { getHighlightPositions } from '@/components/utils/jsonPosition'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

// Local interfaces
export interface ILocalValues {
  materials: { symbol: number; default: string }[]
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
    dispatch(
      setTemplateHighlight({
        begin: (cursor?.row ?? 0) + 1,
        end: (cursor?.row ?? 0) + 4
      })
    )
    dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 4, column: 0 }))
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
  const oldModel = JSON.stringify(modelJSON, null, '\t')
  const index = Object.keys(modelJSON.configuration ?? {}).length
  modelJSON.configuration = {
    ...(modelJSON.configuration ?? {}),
    materials: {
      index: index + 1,
      title: 'Materials',
      ...(modelJSON.configuration?.materials ?? {}),
      children: [
        ...(modelJSON.configuration?.materials?.children ?? []),
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
  const newModel = JSON.stringify(modelJSON, null, '\t')
  const highlight = getHighlightPositions(oldModel, newModel)
  dispatch(setJsonHighlight(highlight))
  dispatch(setJsonCursor({ row: highlight.end, column: 0 }))
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
        title="Materials"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.List name="materials">
          {(fields, { add, remove }, { errors }) => (
            <FormListContainer label="material" add={add} errors={errors}>
              {fields.map((field, index) => (
                <FormListItem
                  key={field.key}
                  label="Material"
                  field={field}
                  index={index}
                  remove={remove}
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
                </FormListItem>
              ))}
            </FormListContainer>
          )}
        </Form.List>
      </Dialog>
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Materials
      </Button>
    </>
  )
}

export default Materials
