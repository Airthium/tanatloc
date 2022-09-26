/** @module Components.Assets.Organization */

import { Button, Tabs, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem
} from '@/api/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

import Users from './users'
import Groups from './groups'

/**
 * Props
 */
export interface IProps {
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
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
export const onName = async (
  organization: IFrontOrganizationsItem,
  name: string,
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
): Promise<void> => {
  try {
    // API
    await OrganizationAPI.update(organization, [
      {
        key: 'name',
        value: name
      }
    ])

    // Local
    swr.mutateOneOrganization({
      ...organization,
      name: name
    })
  } catch (err) {
    ErrorNotification(errors.name, err)
  }
}

/**
 * Organization
 * @param props Props
 * @description
 * Props list:
 * - organization (Object) Organization `{ id, name, owners, [users] }`
 * - swr (Object) SWR functions `{ mutateOneOrganization, loadingOrganizations }`
 * - onClose (Function) On close
 * @returns Organization
 */
const Organization = ({ organization, swr, onClose }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <>
      <div className="display-flex">
        <Button
          className="marginRight-20"
          icon={<ArrowLeftOutlined />}
          onClick={() => onClose()}
        />
        <Typography.Title
          level={3}
          editable={{
            onChange: async (name) =>
              onName(organization, name, {
                mutateOneOrganization: swr.mutateOneOrganization
              })
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
