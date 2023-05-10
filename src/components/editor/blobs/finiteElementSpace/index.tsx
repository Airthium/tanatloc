/** @module Components.Editor.Blobs.FiniteElementSpace */

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Button, Form, Input, InputRef } from 'antd'

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
import { getHighlightPositions } from '@/components/utils/jsonPosition'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

// Local interfaces
export interface ILocalValues {
  name: string
  options: { label: string; value: string; value2D: string }[]
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
  if (!values.options) return
  if (!values.options.length) return

  // Template
  addOnCursor(
    template,
    `<%# Finite element space -%>
<%
const finiteElementSpace = parameters.finiteElementSpace.children[0]
finiteElementSpace.name = '${values.name}'
-%>
<%- include('/blobs/fespace.edp.ejs', {
  mesh,
  finiteElementSpace
}) -%>
`,
    cursor,
    dispatch
  )
  dispatch(
    setTemplateHighlight({
      begin: cursor?.row ?? 0,
      end: (cursor?.row ?? 0) + 9
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 9, column: 0 }))

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
      finiteElementSpace: {
        advanced: true,
        label: 'Finite element space',
        ...((modelJSON.configuration?.parameters
          ?.finiteElementSpace as object) ?? {}),
        children: [
          ...((modelJSON.configuration?.parameters?.finiteElementSpace as any)
            ?.children ?? []),
          {
            label: 'Finite element space label',
            label2D: 'Finite element space label (2D)',
            htmlEntity: 'select',
            options: values.options,
            default: values.options[0].value,
            default2D: values.options[0].value2D
          }
        ]
      }
    }
  }
  const newModel = JSON.stringify(modelJSON, null, '\t')
  const highlight = getHighlightPositions(oldModel, newModel)
  dispatch(setJsonHighlight(highlight))
  dispatch(setJsonCursor({ row: highlight.end, column: 0 }))
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Finite element space
 * @returns FiniteElementSpace
 */
const FiniteElementSpace = (): React.JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { template, model, templateCursor, dispatch } =
    useContext(EditorContext)

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

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
        title="Finite element space"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input ref={inputRef} />
        </Form.Item>
        <Form.List name="datas">
          {(fields, { add, remove }, { errors }) => (
            <FormListContainer
              label="finite element space"
              add={add}
              errors={errors}
            >
              {fields.map((field, index) => (
                <FormListItem
                  key={field.key}
                  label="Option"
                  field={field}
                  index={index}
                  remove={remove}
                >
                  <Form.Item
                    name={[field.name, 'label']}
                    label="Display name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="P1" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'value']}
                    label="Value"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="[P1, P1, P1]" />
                  </Form.Item>
                  <Form.Item
                    name={[field.name, 'value2D']}
                    label="Value 2D"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="[P1, P1]" />
                  </Form.Item>
                </FormListItem>
              ))}
            </FormListContainer>
          )}
        </Form.List>
      </Dialog>
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Finite element space
      </Button>
    </>
  )
}

export default FiniteElementSpace
