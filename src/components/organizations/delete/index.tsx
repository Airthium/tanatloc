/** @module Components.Organizations.Delete */

import { useState } from 'react'
import { Typography } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import {
  IFrontMutateOrganizationsItem,
  IFrontOrganizationsItem
} from '@/api/index.d'
import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  organization: Pick<IFrontOrganizationsItem, 'id' | 'name'>
  swr: {
    delOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
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
export const onDelete = async (
  organization: Pick<IFrontOrganizationsItem, 'id' | 'name'>,
  swr: {
    delOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
): Promise<void> => {
  try {
    // API
    await OrganizationAPI.del({ id: organization.id })

    // Local
    swr.delOneOrganization({ id: organization.id })
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
const Delete = ({ organization, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

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
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(organization, swr)
        } finally {
          setLoading(false)
        }
      }}
      loading={loading}
    />
  )
}

export default Delete
