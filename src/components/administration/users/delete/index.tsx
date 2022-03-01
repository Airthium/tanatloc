/** @module Components.Administration.User.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { IUserWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Props
 */
export interface IProps {
  user: {
    id: string
    email: string
  }
  swr: {
    delOneUser: (user: IUserWithData) => void
  }
}

/**
 * Errors (delete)
 */
const errors = {
  delError: 'Unable to delete user'
}

/**
 * On delete
 * @param user User
 * @param setLoading Set loading
 * @param setVisible Set visible
 * @param swr Swr
 */
export const onDelete = async (
  user: IUserWithData,
  setLoading: Dispatch<SetStateAction<boolean>>,
  swr: { delOneUser: (user: IUserWithData) => void }
): Promise<void> => {
  setLoading(true)

  try {
    // Delete
    await UserAPI.delById(user.id)

    // Mutate
    swr.delOneUser({ id: user.id })
  } catch (err) {
    Error(errors.delError, err)
    throw err
  } finally {
    setLoading(false)
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ user, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <>
      <DeleteButton
        loading={loading}
        text={'Delete ' + user.email + '?'}
        title="Delete user"
        onDelete={async () => onDelete(user, setLoading, swr)}
      />
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
