import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import UserAPI from '@/api/user'
import logout from '@/api/logout'

/**
 * Errors account/delete
 * @memberof module:components/account
 */
const errors = {
  delError: 'Unable to delete the user'
}

/**
 * Delete account
 * @memberof module:components/account
 * @param {Object} props Props
 */
const Delete = ({ swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * Handle delete
   */
  const onDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await UserAPI.del()

      // Logout
      await logout()

      // Mutate
      swr.mutateUser({})
    } catch (err) {
      Error(errors.delError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        title="Delete your account"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        This action cannot be undone. If you delete your account, you will
        permanently lose your workspaces and projects.
      </DeleteDialog>
      <Card title="Delete your account">
        <Button
          icon={<DeleteOutlined />}
          type="danger"
          onClick={() => setVisible(true)}
        >
          Delete your account
        </Button>
      </Card>
    </>
  )
}

Delete.propTypes = {
  swr: PropTypes.exact({
    mutateUser: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
