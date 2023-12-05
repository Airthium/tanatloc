/** @module Components.Account.Delete */

import { ReactNode, useCallback, useContext, useState } from 'react'
import { Card } from 'antd'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import UserAPI from '@/api/user'
import { logout } from '@/api/logout'

/**
 * Props
 */
export interface IProps {
  swr: {
    clearUser: () => Promise<void>
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
  clearUser: () => Promise<void>
}): Promise<void> => {
  // Delete
  await UserAPI.del()

  // Logout
  await logout()

  // Mutate
  await swr.clearUser()
}

/**
 * Delete account
 * @param props Props
 * @returns Delete
 */
const Delete = ({ swr }: IProps): ReactNode => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(swr)
    } catch (err: any) {
      dispatch(addError({ title: errors.del, err }))
      throw err
    } finally {
      setLoading(false)
    }
  }, [swr, dispatch])

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
