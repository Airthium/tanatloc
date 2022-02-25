/** @module Components.Assets.Organization */

import PropTypes from 'prop-types'
import { Button, Tabs, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { IOrganizationWithData } from '@/lib/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import Users from './users'
import Groups from './groups'

import OrganizationAPI from '@/api/organization'

export interface IProps {
  organization: IOrganizationWithData
  swr: {
    mutateOneOrganization: Function
    loadingOrganizations: boolean
  }
  onClose: Function
}

/**
 * Errors
 */
const errors = {
  name: "Unable to update organization's name"
}

/**
 * Organization
 * @param props Props
 * @description
 * Props list:
 * - organization (Object) Organization `{ id, name, owners, [users] }`
 * - swr (Object) SWR functions `{ mutateOneOrganization, loadingOrganizations }`
 * - onClose (Function) On close
 */
const Organization = ({ organization, swr, onClose }: IProps): JSX.Element => {
  /**
   * On name
   * @param name Name
   */
  const onName = async (name: string): Promise<void> => {
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
        <Typography.Title level={3} editable={{ onChange: onName }}>
          {organization.name}
        </Typography.Title>
      </div>
      <Tabs>
        <Tabs.TabPane tab="Users" key="users">
          <Users
            organization={{
              id: organization.id,
              name: organization.name,
              owners: organization.owners,
              users: organization.users
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
              users: organization.users
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
    users: PropTypes.array
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Organization
