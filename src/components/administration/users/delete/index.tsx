/** @module Components.Administration.User.Delete */

import { useState } from 'react'
import { Typography } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { IFrontMutateUsersItem, IFrontUsersItem } from '@/api/index.d'
import UserAPI from '@/api/user'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUsersItem, 'id' | 'email'>
  swr: {
    delOneUser: (user: IFrontMutateUsersItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete user'
}

/**
 * On delete
 * @param user User
 * @param swr Swr
 */
export const onDelete = async (
  user: Pick<IFrontUsersItem, 'id' | 'email'>,
  swr: { delOneUser: (user: IFrontMutateUsersItem) => void }
): Promise<void> => {
  try {
    // Delete
    await UserAPI.delById(user.id)

    // Mutate
    swr.delOneUser({ id: user.id })
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ user, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      loading={loading}
      bordered
      text={
        <>
          Are you sure you want to delete the user{' '}
          <Typography.Text strong>{user.email}</Typography.Text>?
        </>
      }
      title="Delete user"
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(user, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

export default Delete
