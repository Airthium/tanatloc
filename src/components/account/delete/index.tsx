/** @module Components.Account.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Card } from 'antd'

import { IUserWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'
import { logout } from '@/api/logout'

/**
 * Props
 */
export interface IProps {
  swr: {
    mutateUser: (user: IUserWithData) => void
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
  mutateUser: (user: IUserWithData) => void
}): Promise<void> => {
  try {
    // Delete
    await UserAPI.del()

    // Logout
    await logout()

    // Mutate
    swr.mutateUser({})
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState<boolean>(false)

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
    mutateUser: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
