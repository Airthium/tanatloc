/** @module Components.Organizations.Delete */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { Typography } from 'antd'

import {
  IFrontMutateOrganizationsItem,
  IFrontOrganizationsItem
} from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  organization: Pick<IFrontOrganizationsItem, 'id' | 'name'>
  swr: {
    delOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete organization'
}

/**
 * On delete
 * @param organization Organization
 * @param swr SWR
 */
export const _onDelete = async (
  organization: Pick<IFrontOrganizationsItem, 'id' | 'name'>,
  swr: {
    delOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    // API
    await OrganizationAPI.del({ id: organization.id })

    // Local
    await swr.delOneOrganization({ id: organization.id })
  } catch (err: any) {
    dispatch(addError({ title: errors.del, err }))
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ organization, swr }: IProps): React.JSX.Element => {
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
      await _onDelete(organization, swr, dispatch)
    } finally {
      setLoading(false)
    }
  }, [organization, swr, dispatch])

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      title="Delete organization"
      text={
        <>
          Are you sure you want to delete the organization{' '}
          <Typography.Text strong>{organization.name}</Typography.Text>?
        </>
      }
      onDelete={onDelete}
      loading={loading}
    />
  )
}

export default Delete
