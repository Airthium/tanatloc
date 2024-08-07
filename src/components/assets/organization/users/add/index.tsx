/** @module Components.Assets.Organization.User.Add */

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import Utils from '@/lib/utils'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem,
  IFrontUsersItem
} from '@/api/index.d'
import OrganizationAPI from '@/api/organization'

/**
 * Local interfaces
 */
export interface IOrganizationItem
  extends Pick<
    IFrontOrganizationsItem,
    'id' | 'owners' | 'pendingowners' | 'users' | 'pendingusers'
  > {}

/**
 * Props
 */
export interface IProps {
  title: string
  organization: IOrganizationItem
  dBkey: 'owners' | 'users'
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
  add: 'Unable to add user',
  existing: 'This user already exists or its invite is pending'
}

/**
 * CheckAlreadyAdded
 * @param user User
 * @param organization Organization
 */
export const _checkAlreadyAdded = (
  user: { email: string },
  organization: IOrganizationItem
): IFrontUsersItem => {
  const inOwners = organization.owners?.find((o) => o.email === user.email)
  const inPendingowners = organization.pendingowners?.find(
    (po) => po.email === user.email
  )
  const inUsers = organization.users?.find((u) => u.email === user.email)
  const inPendingusers = organization.pendingusers?.find(
    (pu) => pu.email === user.email
  )

  return (inOwners ??
    inPendingowners ??
    inUsers ??
    inPendingusers) as IFrontUsersItem
}

/**
 * On finish
 * @param organization Organization
 * @param dBkey Database key
 * @param values Values
 * @param swr SWR
 */
export const _onFinish = async (
  organization: IOrganizationItem,
  dBkey: 'owners' | 'users',
  values: { email: string },
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
): Promise<void> => {
  // Check
  const exists = _checkAlreadyAdded(values, organization)
  if (exists) {
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
    const newOrganization = Utils.deepCopy(organization)
    newOrganization[dBkey] = [
      ...newOrganization[dBkey],
      {
        email: values.email
      } as IFrontOrganizationsItem['users'][0]
    ]
    await swr.mutateOneOrganization(newOrganization)
  } catch (err: any) {
    throw new Error(errors.add)
  }
}

/**
 * Add
 * @param props Props
 *
 * Props:
 * - title (string) Title
 * - organization (Object) Organization `{ id, [dBkey] }`
 * - dBkey (string) Database key, must be `owners`, `pendingowners`, `user` or `pendingusers`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 * @returns Add
 */
const Add: React.FunctionComponent<IProps> = ({
  title,
  organization,
  dBkey,
  swr
}) => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: { email: string }): Promise<void> => {
      setLoading(true)
      try {
        await _onFinish(organization, dBkey, values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err: any) {
        dispatch(addError({ title: err.message, err: err }))
        setLoading(false)
        throw err
      }
    },
    [organization, dBkey, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        visible={visible}
        loading={loading}
        title={title}
        onCancel={setVisibleFalse}
        onOk={onOk}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input ref={inputRef} />
        </Form.Item>
      </Dialog>

      <AddButton onAdd={setVisibleTrue}>{title}</AddButton>
    </>
  )
}

export default Add
