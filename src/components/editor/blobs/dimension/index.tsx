/** @module Components.Editor.Blobs.Dimension */

import { Dispatch, useContext } from 'react'
import { Button } from 'antd'

import { EditorContext, IEditorAction, IEditorCursor } from '@/context/editor'
import { setCursor } from '@/context/editor/actions'

import { globalStyle } from '@/styles'

import { addOnCursor } from '..'

/**
 * On add
 * @param template Tempalte
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
    `<%# Dimension -%>
<%- include('/blobs/dimensioning.edp.ejs', {
    dimension
}) -%>
`,
    cursor,
    dispatch
  )
  dispatch(setCursor({ row: (cursor?.row || 0) + 4, column: 0 }))
}

/**
 * Dimension
 * @returns Dimension
 */
const Dimension = (): JSX.Element => {
  // Context
  const { template, cursor, dispatch } = useContext(EditorContext)

  /**
   * Render
   */
  return (
    <Button
      css={globalStyle.fullWidth}
      onClick={() => onAdd(template, cursor, dispatch)}
    >
      Dimension
    </Button>
  )
}

export default Dimension
