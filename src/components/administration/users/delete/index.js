import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Delete errors
 * @memberof module:components/administration
 */
const errors = {
  delError: 'Unable to delete user'
}

/**
 * Delete
 * @memberof module:components/administration
 * @param {Object} props Props
 */
const Delete = ({ user, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async () => {
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
        type="danger"
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
