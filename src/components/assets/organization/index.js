/** @namespace Components.Assets.Organization */

import PropTypes from 'prop-types'
import { Button, Tabs, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { Error as ErrorNotification } from '@/components/assets/notification'

import Users from './users'
import Groups from './groups'

import OrganizationAPI from '@/api/organization'

/**
 * Errors
 * @memberof Components.Assets.Organization
 */
const errors = {
  name: "Unable to update organization's name"
}

/**
 * Organization
 * @memberof Components.Assets.Organization
 * @param {Object} props Props `{ organization, swr, onClose }`
 *
 * @description
 * Props:
 * - organization: Organization `{ id, name, owners, [users] }`
 * - swr: SWR functions `{ mutateOneOrganization, loadingOrganizations }`
 * - onClose: On close function
 */
const Organization = ({ organization, swr, onClose }) => {
  /**
   * On name
   * @param {string} name Name
   */
  const onName = async (name) => {
    try {
      // API
      await OrganizationAPI.update(organization.id, [
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
      <div style={{ display: 'flex' }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onClose}
          style={{ marginRight: '20px' }}
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
