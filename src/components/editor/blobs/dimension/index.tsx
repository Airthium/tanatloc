/** @module Components.Editor.Blobs.Dimension */

import { Dispatch, useCallback, useContext } from 'react'
import { Button } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import {
  setTemplateCursor,
  setTemplateHighlight
} from '@/context/editor/actions'

import { addOnCursor } from '..'

import globalStyle from '@/styles/index.module.css'

/**
 * On add
 * @param template Tempalte
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const _onAdd = (
  template: string,
  cursor: IEditorCursor | undefined,
  dispatch: Dispatch<IEditorAction>
): void => {
  // Template
  addOnCursor(
    template,
    `<%# Dimension -%>
<%- include('/blobs/dimensioning.edp.ejs', {
    dimension
}) -%>
`,
    cursor,
    dispatch
  )
  dispatch(
    setTemplateHighlight({
      begin: cursor?.row ?? 0,
      end: (cursor?.row ?? 0) + 4
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 4, column: 0 }))
}

/**
 * Dimension
 * @returns Dimension
 */
const Dimension: React.FunctionComponent = () => {
  // Context
  const { template, templateCursor, dispatch } = useContext(EditorContext)

  /**
   * On click
   */
  const onClick = useCallback(
    () => _onAdd(template, templateCursor, dispatch),
    [template, templateCursor, dispatch]
  )

  /**
   * Render
   */
  return (
    <Button className={globalStyle.fullWidth} onClick={onClick}>
      Dimension
    </Button>
  )
}

export default Dimension
