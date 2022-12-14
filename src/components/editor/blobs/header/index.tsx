/** @module Components.Editor.Blobs.Header */

import { Dispatch, useCallback, useContext } from 'react'
import { Button } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor } from '@/context/editor/actions'

import { addOnCursor } from '..'

import { globalStyle } from '@/styles'

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
   * On click
   */
  const onClick = useCallback(
    () => _onAdd(template, cursor, dispatch),
    [template, cursor, dispatch]
  )

  /**
   * Render
   */
  return (
    <Button css={globalStyle.fullWidth} onClick={onClick}>
      Header
    </Button>
  )
}

export default Header
