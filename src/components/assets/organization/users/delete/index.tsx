/** @module Components.Assets.Organization.User.Delete */

import { useCallback, useState } from 'react'
import { Typography } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem,
  IFrontUsersItem
} from '@/api/index.d'
import OrganizationAPI from '@/api/organization'

/**
 * Local interfacs
 */
export interface IOrganizationItem
  extends Pick<
    IFrontOrganizationsItem,
    'id' | 'owners' | 'pendingowners' | 'users' | 'pendingusers'
  > {}

export interface IUserItem
  extends Pick<IFrontUsersItem, 'id' | 'email' | 'firstname' | 'lastname'> {}

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  user: IUserItem
  organization: IOrganizationItem
  dBkey: 'owners' | 'pendingowners' | 'users' | 'pendingusers'
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
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
 * @param organization Organization
 * @param dBkey Database key
 * @param swr SWR
 */
export const _onDelete = async (
  user: IUserItem,
  organization: IOrganizationItem,
  dBkey: 'owners' | 'pendingowners' | 'users' | 'pendingusers',
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
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
    const newOrganization = Utils.deepCopy(organization)
    newOrganization[dBkey] = newOrganization[dBkey].filter(
      (u) => u.id !== user.id
    )
    await swr.mutateOneOrganization(newOrganization)
  } catch (err: any) {
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
}: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Set name
   * @param u User
   */
  const setName = useCallback((u: IUserItem): string => {
    if (u.firstname || u.lastname) return u.firstname + ' ' + u.lastname
    else return u.email
  }, [])

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(user, organization, dBkey, swr)
    } finally {
      setLoading(false)
    }
  }, [user, organization, dBkey, swr])

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
      onDelete={onDelete}
    />
  )
}

export default Delete
