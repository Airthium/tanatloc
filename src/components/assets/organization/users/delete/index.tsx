/** @module Components.Assets.Organization.User.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Typography } from 'antd'

import { IOrganizationWithData, IUserWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  user: IUserWithData
  organization: IOrganizationWithData
  dBkey: 'owners' | 'pendingowners' | 'users' | 'pendingusers'
  swr: {
    mutateOneOrganization: (organization: IOrganizationWithData) => void
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
 * @param organization Organization
 * @param user User
 * @param dBkey Database key
 * @param swr SWR
 */
export const onDelete = async (
  organization: IOrganizationWithData,
  user: IUserWithData,
  dBkey: 'owners' | 'pendingowners' | 'users' | 'pendingusers',
  swr: { mutateOneOrganization: (organization: IOrganizationWithData) => void }
): Promise<void> => {
  try {
    // API
    await OrganizationAPI.update(organization, [
      {
        key: dBkey,
        type: 'array',
        method: 'remove',
        value: user.id
      }
    ])

    // Local
    const newOrganization = { ...organization }
    newOrganization[dBkey] = newOrganization[dBkey].filter(
      (u) => u.id !== user.id
    )
    swr.mutateOneOrganization(newOrganization)
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @description
 * Props list:
 * - disabled (boolean) Set disabled state
 * - user (Object) User `{ id, email, [firstname], [lastname] }`
 * - organization (Object) Organization `{ id, [dBkey] }`
 * - dbKey (string) Database key, must be `owners`, `pendingowners`, `users` or `pendingusers`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 * @returns Delete
 */
const Delete = ({
  disabled,
  user,
  organization,
  dBkey,
  swr
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Set name
   * @param u User
   */
  const setName = useCallback((u: IUserWithData) => {
    if (u.firstname || u.lastname) return u.firstname + ' ' + u.lastname
    else return u.email
  }, [])

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      disabled={disabled}
      title="Delete organization"
      text={
        <>
          Are you sure you want to delete the user{' '}
          <Typography.Text strong>{setName(user)}</Typography.Text>?
        </>
      }
      loading={loading}
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(organization, user, dBkey, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

Delete.propTypes = {
  disabled: PropTypes.bool,
  user: PropTypes.exact({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string
  }).isRequired,
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    owners: PropTypes.array,
    pendingowners: PropTypes.array,
    users: PropTypes.array,
    pendingusers: PropTypes.array
  }),
  dBkey: PropTypes.oneOf(['owners', 'pendingowners', 'users', 'pendingusers']),
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
