/** @module Components.Editor.Blobs.Header */

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
 * @param template Template
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
    `<%# Headers -%>
<%- include('/blobs/headers.edp.ejs') -%>
`,
    cursor,
    dispatch
  )
  dispatch(
    setTemplateHighlight({
      begin: (cursor?.row ?? 0) + 1,
      end: (cursor?.row ?? 0) + 2
    })
  )
  dispatch(setTemplateCursor({ row: (cursor?.row ?? 0) + 2, column: 0 }))
}

/**
 * Header
 * @returns Header
 */
const Header: React.FunctionComponent = () => {
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
      Header
    </Button>
  )
}

export default Header
