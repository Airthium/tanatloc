/** @module Components.Editor.Blobs.Mesh */

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
  setTemplateHighlight
} from '@/context/editor/actions'

import Dialog from '@/components/assets/dialog'

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
    dispatch(
      setTemplateHighlight({
        begin: cursor?.row ?? 0,
        end: (cursor?.row ?? 0) + 9
      })
    )
    dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 9, column: 0 }))
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
  const index = Object.keys(modelJSON.configuration ?? {}).length
  modelJSON.configuration = {
    ...(modelJSON.configuration ?? {}),
    geometry: {
      index: index + 1,
      title: 'Geometry',
      mesh: {
        name: values.name
      },
      ...(modelJSON.configuration?.geometry ?? {}),
      meshable: true
    }
  }
  // TODO cursor position & highlight
  dispatch(setModel(JSON.stringify(modelJSON, null, '\t')))
}

/**
 * Mesh
 * @returns Mesh
 */
const Mesh = (): JSX.Element => {
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
    /* istanbul ignore next */
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
    async (values: { name: string }): Promise<void> => {
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
        title="Mesh"
        visible={visible}
        loading={loading}
        onOk={onOk}
        onCancel={setVisibleFalse}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input ref={inputRef} />
        </Form.Item>
      </Dialog>
      <Button className={globalStyle.fullWidth} onClick={setVisibleTrue}>
        Mesh
      </Button>
    </>
  )
}

export default Mesh
