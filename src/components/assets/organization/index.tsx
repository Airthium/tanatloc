/** @module Components.Assets.Organization */

import PropTypes from 'prop-types'
import { Button, Tabs, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { IOrganizationWithData } from '@/lib/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

import Users from './users'
import Groups from './groups'

/**
 * Props
 */
export interface IProps {
  organization: IOrganizationWithData
  swr: {
    mutateOneOrganization: (organization: IOrganizationWithData) => void
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
  organization: IOrganizationWithData,
  name: string,
  swr: { mutateOneOrganization: (organization: IOrganizationWithData) => void }
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
      <Tabs>
        <Tabs.TabPane tab="Users" key="users">
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Groups" key="groups">
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
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

Organization.propTypes = {
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    owners: PropTypes.array.isRequired,
    pendingowners: PropTypes.array,
    users: PropTypes.array,
    pendingusers: PropTypes.array,
    groups: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Organization
