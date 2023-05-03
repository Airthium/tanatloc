/** @module Components.Account.Delete */

import { useCallback, useState } from 'react'
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
  del: 'Unable to delete user'
}

/**
 * Handle delete
 * @param swr SWR
 */
export const _onDelete = async (swr: {
  clearUser: () => void
}): Promise<void> => {
  try {
    // Delete
    await UserAPI.del()

    // Logout
    await logout()

    // Mutate
    swr.clearUser()
  } catch (err: any) {
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
   * On delete
   */
  const onDelete = useCallback(async () => {
    setLoading(true)
    try {
      await _onDelete(swr)
    } finally {
      setLoading(false)
    }
  }, [swr])

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
        onDelete={onDelete}
      >
        Delete your account
      </DeleteButton>
    </Card>
  )
}

export default Delete
