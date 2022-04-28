/** @module Components.Assets.Organization.User.Add */

import { useState } from 'react'
import { Form, Input } from 'antd'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem,
  IFrontUsersItem
} from '@/api/index.d'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Custom Types
 */
export type TOrganizationItem = Pick<
  IFrontOrganizationsItem,
  'id' | 'owners' | 'pendingowners' | 'users' | 'pendingusers'
>

/**
 * Props
 */
export interface IProps {
  title: string
  organization: TOrganizationItem
  dBkey: 'owners' | 'users'
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
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
 * @param user User
 * @param organization Organization
 */
export const checkAlreadyAdded = (
  user: { email: string },
  organization: TOrganizationItem
): IFrontUsersItem => {
  const inOwners = organization.owners?.find((o) => o.email === user.email)
  const inPendingowners = organization.pendingowners?.find(
    (po) => po.email === user.email
  )
  const inUsers = organization.users?.find((u) => u.email === user.email)
  const inPendingusers = organization.pendingusers?.find(
    (pu) => pu.email === user.email
  )

  return (inOwners ||
    inPendingowners ||
    inUsers ||
    inPendingusers) as IFrontUsersItem
}

/**
 * On finish
 * @param organization Organization
 * @param dBkey Database key
 * @param values Values
 * @param swr SWR
 */
export const onFinish = async (
  organization: TOrganizationItem,
  dBkey: 'owners' | 'users',
  values: { email: string },
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
): Promise<void> => {
  // Check
  const exists = checkAlreadyAdded(values, organization)
  if (exists) {
    ErrorNotification(errors.existing)
    throw new Error(errors.existing)
  }

  try {
    // API
    await OrganizationAPI.update(organization, [
      {
        key: dBkey,
        type: 'array',
        method: 'append',
        value: values.email.trim()
      }
    ])

    // Local
    const newOrganization = { ...organization }
    newOrganization[dBkey] = [
      ...newOrganization[dBkey],
      {
        email: values.email
      } as IFrontOrganizationsItem['users'][0]
    ]
    swr.mutateOneOrganization(newOrganization)
  } catch (err) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @description
 * Props:
 * - title (string) Title
 * - organization (Object) Organization `{ id, [dBkey] }`
 * - dBkey (string) Database key, must be `owners`, `pendingowners`, `user` or `pendingusers`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 * @returns Add
 */
const Add = ({ title, organization, dBkey, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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

export default Add
