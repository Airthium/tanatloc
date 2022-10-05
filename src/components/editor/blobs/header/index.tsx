/** @module Components.Editor.Blobs.Header */

import { Dispatch, useContext } from 'react'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor } from '@/context/editor/actions'

import { addOnCursor } from '..'
import { Button } from 'antd'

/**
 * On add
 * @param template Template
 * @param cursor Cursor
 * @param dispatch Dispatch
 */
export const onAdd = (
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
  dispatch(setCursor({ row: (cursor?.row || 0) + 2, column: 0 }))
}

/**
 * Header
 * @returns Header
 */
const Header = (): JSX.Element => {
  // Context
  const { template, cursor, dispatch } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <Button
      className="full-width"
      onClick={() => onAdd(template, cursor, dispatch)}
    >
      Header
    </Button>
  )
}

export default Header
