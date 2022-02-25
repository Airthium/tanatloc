/** @module Components.Administration.User.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

export interface IProps {
  user: {
    id: string
    email: string
  }
  swr: {
    delOneUser: Function
  }
}

/**
 * Errors (delete)
 */
const errors = {
  delError: 'Unable to delete user'
}

/**
 * Delete
 * @param props Props
 */
const Delete = ({ user, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On delete
   */
  const onDelete = async (): Promise<void> => {
    setLoading(true)

    try {
      // Delete
      await UserAPI.delById(user.id)

      // Mutate
      swr.delOneUser({ id: user.id })

      // Close
      setVisible(false)
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
      <Button
        icon={<DeleteOutlined />}
        danger
        onClick={() => setVisible(true)}
      />
      <DeleteDialog
        title="Delete user"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        Delete {user.email}?
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    delOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
