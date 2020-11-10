import { useState } from 'react'
import { message, Button, Card } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '../../assets/dialog'

import { useUser, del } from '../../../../src/api/user'
import logout from '../../../../src/api/logout'

import Sentry from '../../../../src/lib/sentry'

/**
 * Delete account
 * @memberof module:renderer/components/account
 */
const Delete = () => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const [, { mutateUser }] = useUser()

  /**
   * Handle delete
   */
  const handleDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await del()

      // Logout
      await logout()

      // Mutate
      mutateUser({})
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Card
      title="Delete your account"
      bodyStyle={{ textAlign: 'center' }}
      className="Vertical-gutter"
    >
      <Button
        icon={<DeleteOutlined />}
        type="danger"
        onClick={() => setVisible(true)}
      >
        Delete your account
      </Button>
      <DeleteDialog
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={handleDelete}
        loading={loading}
      >
        This action cannot be undone. If you delete your account, you will
        permanently lose your workspaces and projects.
      </DeleteDialog>
    </Card>
  )
}

export default Delete
