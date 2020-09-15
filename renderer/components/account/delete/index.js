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
      // throw new Error('browser test')
      // Delete
      await del()

      // Logout
      await logout()

      // Mutate
      mutateUser({})

      setLoading(false)
    } catch (err) {
      console.log(Sentry)
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
