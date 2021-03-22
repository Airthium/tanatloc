import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import WorkspaceAPI from '@/api/workspace'

const errors = {
  delError: 'Unable to delete the workspace'
}

/**
 * Delete workspace
 * @memberof module:components/workspace
 * @param {Object} props Props
 */
const Delete = ({ workspace, swr }) => {
  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * Toggle dialog delete
   */
  const toggleDialog = () => {
    setVisible(!visible)
  }

  /**
   * Handle delete
   */
  const handleDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await WorkspaceAPI.del({ id: workspace.id })

      // Mutate
      swr.delOneWorkspace({ id: workspace.id })
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
      <Button type="danger" onClick={toggleDialog} icon={<DeleteOutlined />}>
        Delete
      </Button>
      <DeleteDialog
        title="Delete the workspace"
        visible={visible}
        onCancel={toggleDialog}
        onOk={handleDelete}
        loading={loading}
      >
        The projects contained in this workspace will be lost.
      </DeleteDialog>
    </>
  )
}

export default Delete
