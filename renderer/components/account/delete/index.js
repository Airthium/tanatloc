import { useState } from 'react'
import { message, Button, Card } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '../../assets/dialog'

import { useUser, del } from '../../../../src/api/user'

/**
 * Delete account
 * @memberof module:renderer/components/account
 */
const Delete = () => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { mutateUser }] = useUser()

  /**
   * Handle delete
   */
  const handleDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await del()

      // Mutate
      mutateUser(null)
      // TODO logout ?

      setLoading(false)
    } catch (err) {
      message.error(err.message)
      console.error(err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Card title="Remove">
      <Button
        icon={<DeleteOutlined />}
        type="danger"
        onClick={() => setVisible(true)}
      >
        Remove your account
      </Button>
      <DeleteDialog
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleDelete}
        loading={loading}
      >
        All workspace and projects from your account will be lost.
      </DeleteDialog>
    </Card>
  )
}

export default Delete
