import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import UserAPI from '@/api/user'
import { logout } from '@/api/logout'

interface IProps {
  swr: {
    mutateUser: Function
  }
}

/**
 * Errors (delete)
 * @memberof Components.Account
 */
const errors = {
  del: 'Unable to delete the user'
}

/**
 * Delete account
 * @memberof Components.Account
 * @param props Props
 */
const Delete = ({ swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * Handle delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)
    try {
      // Delete
      await UserAPI.del()

      // Logout
      await logout()

      // Mutate
      swr.mutateUser({})
    } catch (err) {
      ErrorNotification(errors.del, err)
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
          danger
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
