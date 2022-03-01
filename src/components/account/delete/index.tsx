/** @module Components.Account.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Card } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { IUserWithData } from '@/lib/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import UserAPI from '@/api/user'
import { logout } from '@/api/logout'

export interface IProps {
  swr: {
    mutateUser: (user: IUserWithData) => void
  }
}

/**
 * Errors
 */
const errors = {
  del: 'Unable to delete the user'
}

/**
 * Handle delete
 * @param setLoading Set loading
 * @param swr SWR
 */
export const onDelete = async (
  setLoading: Function,
  swr: { mutateUser: (user: IUserWithData) => void }
): Promise<void> => {
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
 * Delete account
 * @param props Props
 * @returns Delete
 */
const Delete = ({ swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        title="Delete your account"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => onDelete(setLoading, swr)}
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
