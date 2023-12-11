/** @module Components.Administration.User.Delete */

import { useCallback, useContext, useState } from 'react'
import { Typography } from 'antd'

import { IFrontMutateUsersItem, IFrontUsersItem } from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import UserAPI from '@/api/user'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUsersItem, 'id' | 'email'>
  swr: {
    delOneUser: (user: IFrontMutateUsersItem) => Promise<void>
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
 * @param dispatch Dispatch
 */
export const _onDelete = async (
  user: Pick<IFrontUsersItem, 'id' | 'email'>,
  swr: { delOneUser: (user: IFrontMutateUsersItem) => Promise<void> }
): Promise<void> => {
  // Delete
  await UserAPI.delById(user.id)

  // Mutate
  await swr.delOneUser({ id: user.id })
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete: React.FunctionComponent<IProps> = ({ user, swr }) => {
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
      await _onDelete(user, swr)
    } catch (err: any) {
      dispatch(addError({ title: errors.del, err }))
      throw err
    } finally {
      setLoading(false)
    }
  }, [user, swr, dispatch])

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
      onDelete={onDelete}
    />
  )
}

export default Delete
