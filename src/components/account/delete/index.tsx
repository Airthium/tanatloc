/** @module Components.Account.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Card } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'
import { logout } from '@/api/logout'

/**
 * Props
 */
export interface IProps {
  swr: {
    clearUser: () => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete the user'
}

/**
 * Handle delete
 * @param swr SWR
 */
export const onDelete = async (swr: {
  clearUser: () => void
}): Promise<void> => {
  try {
    // Delete
    await UserAPI.del()

    // Logout
    await logout()

    // Mutate
    swr.clearUser()
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete account
 * @param props Props
 * @returns Delete
 */
const Delete = ({ swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <Card title="Delete your account">
      <DeleteButton
        title="Delete your account"
        text="This action cannot be undone. If you delete your account, you will permanently lose your workspaces and projects."
        bordered
        loading={loading}
        onDelete={async () => {
          setLoading(true)
          try {
            await onDelete(swr)
          } finally {
            setLoading(false)
          }
        }}
      >
        Delete your account
      </DeleteButton>
    </Card>
  )
}

Delete.propTypes = {
  swr: PropTypes.exact({
    clearUser: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
