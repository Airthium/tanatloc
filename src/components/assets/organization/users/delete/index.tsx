/** @module Components.Assets.Organization.User.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'

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
  dBkey: 'owners' | 'users'
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
  dBkey: 'owners' | 'users',
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
 * - dbKey (string) Database key, must be `owners` or `users`
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
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      disabled={disabled}
      title="Delete organization"
      text={
        'Delete ' + user.firstname || user.lastname
          ? user.firstname + ' ' + user.lastname
          : user.email + '?'
      }
      loading={loading}
      onDelete={async () => {
        setLoading(true)
        await onDelete(organization, user, dBkey, swr)
        setLoading(false)
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
    users: PropTypes.array
  }),
  dBkey: PropTypes.oneOf(['owners', 'users']),
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
