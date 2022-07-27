import { Dispatch, useContext } from 'react'
import { FileAddOutlined } from '@ant-design/icons'
import { Button, Tooltip } from 'antd'

import { EditorContext, IEditorAction } from '@/context/editor'
import { setModel, setTemplate } from '@/context/editor/actions'

/**
 * On new
 * @param dispatch Dispatch
 */
export const onNew = (dispatch: Dispatch<IEditorAction>) => {
  dispatch(
    setTemplate(
      `try{
<%# Headers -%>
<%- helpers.indent(include('/blobs/headers.edp.ejs'), 1) -%>

<%# Dimension -%>
<%- helpers.indent(include('/blobs/dimensioning.edp.ejs', {
\tdimension
}), 1) -%>

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
      )
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
   * Render
   */
  return (
    <Tooltip title="New model">
      <Button icon={<FileAddOutlined />} onClick={() => onNew(dispatch)} />
    </Tooltip>
  )
}

export default New
