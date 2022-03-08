/** @module Components.Organizations.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'

import { IOrganizationWithData } from '@/lib/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  organization: IOrganizationWithData
  swr: {
    delOneOrganization: (organization: IOrganizationWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete the organization'
}

/**
 * On delete
 * @param organization Organization
 * @param swr SWR
 */
export const onDelete = async (
  organization: IOrganizationWithData,
  swr: { delOneOrganization: (organization: IOrganizationWithData) => void }
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      title="Delete organization"
      text={'Delete ' + organization?.name + '?'}
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

Delete.propTypes = {
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    delOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
