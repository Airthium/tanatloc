/** @module Components.Assets.Organization */

import { useCallback, useContext } from 'react'
import { Button, Tabs, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import OrganizationAPI from '@/api/organization'

import Users from './users'
import Groups from './groups'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
    loadingOrganizations: boolean
  }
  onClose: () => void
}

/**
 * Errors
 */
export const errors = {
  name: "Unable to update organization's name"
}

/**
 * On name
 * @param organization Organization
 * @param name Name
 * @param swr SWR
 */
export const _onName = async (
  organization: IFrontOrganizationsItem,
  name: string,
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
): Promise<void> => {
  // API
  await OrganizationAPI.update(organization, [
    {
      key: 'name',
      value: name
    }
  ])

  // Local
  await swr.mutateOneOrganization({
    ...organization,
    name: name
  })
}

/**
 * Organization
 * @param props Props
 *
 * Props list:
 * - organization (Object) Organization `{ id, name, owners, [users] }`
 * - swr (Object) SWR functions `{ mutateOneOrganization, loadingOrganizations }`
 * - onClose (Function) On close
 * @returns Organization
 */
const Organization: React.FunctionComponent<IProps> = ({
  organization,
  swr,
  onClose
}) => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On change
   * @param name Name
   */
  const onChange = useCallback(
    (name: string): void => {
      asyncFunctionExec(async () => {
        try {
          await _onName(organization, name, {
            mutateOneOrganization: swr.mutateOneOrganization
          })
        } catch (err: any) {
          dispatch(addError({ title: errors.name, err }))
        }
      })
    },
    [organization, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <div className={globalStyle.displayFlex}>
        <Button
          style={{ marginRight: '20px' }}
          icon={<ArrowLeftOutlined />}
          onClick={onClose}
        />
        <Typography.Title
          level={3}
          editable={{
            onChange
          }}
        >
          {organization.name}
        </Typography.Title>
      </div>
      <Tabs
        items={[
          {
            key: 'users',
            label: 'Users',
            children: (
              <Users
                organization={{
                  id: organization.id,
                  owners: organization.owners,
                  pendingowners: organization.pendingowners,
                  users: organization.users,
                  pendingusers: organization.pendingusers
                }}
                swr={{
                  mutateOneOrganization: swr.mutateOneOrganization,
                  loadingOrganizations: swr.loadingOrganizations
                }}
              />
            )
          },
          {
            key: 'groups',
            label: 'Groups',
            children: (
              <Groups
                organization={{
                  id: organization.id,
                  owners: organization.owners,
                  users: organization.users,
                  groups: organization.groups
                }}
                swr={{
                  mutateOneOrganization: swr.mutateOneOrganization
                }}
              />
            )
          }
        ]}
      />
    </>
  )
}

export default Organization
