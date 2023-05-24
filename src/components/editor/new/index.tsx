/** @module Components.Editor.New */

import { Dispatch, useCallback, useContext } from 'react'
import { FileAddOutlined } from '@ant-design/icons'
import { Button, Modal, Tooltip } from 'antd'

import { EditorContext, IEditorAction } from '@/context/editor'
import { setModel, setTemplate } from '@/context/editor/actions'

/**
 * On new
 * @param dispatch Dispatch
 */
export const _onNew = (dispatch: Dispatch<IEditorAction>): void => {
  dispatch(
    setTemplate(
      `try{
<%# Headers -%>
<%- include('/blobs/headers.edp.ejs') -%>

<%# Dimension -%>
<%- include('/blobs/dimensioning.edp.ejs', {
\tdimension
}) -%>

// WRITE YOUR TEMPLATE HERE

} catch(...) {
\tappendError("An internal error occurs");
\texit(-1);
}
`
    )
  )

  dispatch(
    setModel(
      JSON.stringify(
        {
          category: 'Category',
          name: 'My new model',
          algorithm: 'Algorithm',
          code: 'FreeFEM',
          version: '1.0.0',
          description: '',
          configuration: {}
        },
        null,
        '\t'
      ) + '\n'
    )
  )
}

/**
 * New
 * @returns New
 */
const New = () => {
  // Data
  const { dispatch } = useContext(EditorContext)

  /**
   * On click
   */
  const onClick = useCallback((): void => {
    Modal.confirm({
      title: 'Your modifications will be lost. Do you want to continue?',
      onOk: () => _onNew(dispatch)
    })
  }, [dispatch])

  /**
   * Render
   */
  return (
    <Tooltip title="New model">
      <Button icon={<FileAddOutlined />} onClick={onClick} id="new" />
    </Tooltip>
  )
}

export default New
