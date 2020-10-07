import { useState } from 'react'
import { message, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '../../assets/dialog'

import { useWorkspaces, del } from '../../../../src/api/workspace'

import Sentry from '../../../../src/lib/sentry'

/**
 * Delete workspace
 * @memberof module:renderer/components/workspace
 * @param {Object} props Props
 */
const Delete = (props) => {
  // Props
  const workspace = props.workspace

  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { delOneWorkspace }] = useWorkspaces()

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
      await del({ id: workspace.id })

      // Mutate
      delOneWorkspace({ id: workspace.id })
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)

      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={toggleDialog} icon={<DeleteOutlined />}>
        Delete
      </Button>
      <DeleteDialog
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
