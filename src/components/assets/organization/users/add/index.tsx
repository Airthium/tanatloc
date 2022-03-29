/** @module Components.Assets.Organization.User.Add */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { IOrganizationWithData } from '@/lib/index.d'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  title: string
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
  add: 'Unable to add user',
  existing: 'This user already exists or its invite is pending'
}

/**
 * CheckAlreadyAdded
 * @param value Value
 * @param organization Organization
 */

export const checkAlreadyAdded = (
  value: { email: string },
  organization: IOrganizationWithData
): boolean => {
  let currentlyOwner = !organization.owners.find(
    (owner) => owner.email === value.email
  )
  let currentlyPendingOwner = !organization.pendingowners.find(
    (pendingowner) => pendingowner.email === value.email
  )
  let currentlyUser = !organization.users.find(
    (user) => user.email === value.email
  )
  let currentlyPendingUser = !organization.pendingusers.find(
    (pendinguser) => pendinguser.email === value.email
  )

  return (
    currentlyOwner &&
    currentlyPendingOwner &&
    currentlyUser &&
    currentlyPendingUser
  )
}

/**
 * On finish
 * @param organization Organization
 * @param dBkey Database key
 * @param values Values
 * @param swr SWR
 */
export const onFinish = async (
  organization: IOrganizationWithData,
  dBkey: 'owners' | 'users',
  values: { email: string },
  swr: { mutateOneOrganization: (organization: IOrganizationWithData) => void }
): Promise<void> => {
  let checked = checkAlreadyAdded(values, organization)
  if (checked) {
    try {
      // API
      await OrganizationAPI.update(organization, [
        {
          key: dBkey,
          type: 'array',
          method: 'append',
          value: values.email
        }
      ])

      // Local
      const newOrganization = { ...organization }
      newOrganization[dBkey] = [
        ...(newOrganization[dBkey] || []),
        { email: values.email }
      ]
      swr.mutateOneOrganization(newOrganization)
    } catch (err) {
      ErrorNotification(errors.add, err)
      throw err
    }
  } else {
    ErrorNotification(errors.existing)
  }
}

/**
 * Add
 * @param props Props
 * @description
 * Props:
 * - title (string) Title
 * - organization (Object) Organization `{ id, [dBkey] }`
 * - dBkey (string) Database key, must be `pendingowners` or `pendingusers`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 * @returns Add
 */
const Add = ({ title, organization, dBkey, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        visible={visible}
        loading={loading}
        title={title}
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            await onFinish(organization, dBkey, values, swr)

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input />
        </Form.Item>
      </Dialog>

      <AddButton onAdd={() => setVisible(true)}>{title}</AddButton>
    </>
  )
}

Add.propTypes = {
  title: PropTypes.string.isRequired,
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    owners: PropTypes.array,
    users: PropTypes.array,
    pendingowners: PropTypes.array,
    pendingusers: PropTypes.array
  }).isRequired,
  dBkey: PropTypes.oneOf(['owners', 'users']),
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Add
