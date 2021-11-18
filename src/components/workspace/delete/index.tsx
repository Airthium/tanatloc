import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

interface IProps {
  workspace: {
    id: string
  }
  swr: {
    delOneWorkspace: Function
  }
}

/**
 * Errors (delete)
 * @memberof Components.Workspace
 */
const errors = {
  delError: 'Unable to delete the workspace'
}

/**
 * Delete workspace
 * @memberof Components.Workspace
 * @param {Object} props Props `{ workspace, swr }`
 */
const Delete = ({ workspace, swr }: IProps): JSX.Element => {
  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      // Delete
      await WorkspaceAPI.del({ id: workspace.id })

      // Mutate
      swr.delOneWorkspace({ id: workspace.id })

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.delError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        danger
        onClick={() => setVisible(true)}
        icon={<DeleteOutlined />}
      />
      <DeleteDialog
        title="Delete the workspace"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        The projects contained in this workspace will be lost.
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  workspace: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    delOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
