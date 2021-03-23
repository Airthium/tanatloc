import PropTypes from 'prop-types'
import { Button, Tabs, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import Users from './users'
import Groups from './groups'

import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Organization errors
 * @memberof module:components/organizations
 */
const errors = {
  nameError: "Unable to update organization's name"
}

/**
 * Organization
 * @memberof module:components/organizations
 * @param {Object} props Props
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
      Error(errors.nameError, err)
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
          {organization?.name}
        </Typography.Title>
      </div>
      <Tabs>
        <Tabs.TabPane tab="Users" key="users">
          <Users
            organization={organization}
            swr={{
              mutateOneOrganization: swr.mutateOneOrganization,
              loadingOrganizations: swr.loadingOrganizations
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Groups" key="groups">
          <Groups
            organization={organization}
            swr={{ reloadOrganizations: swr.reloadOrganizations }}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

Organization.propTypes = {
  organization: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    owners: PropTypes.array,
    users: PropTypes.array
  }).isRequired,
  swr: PropTypes.shape({
    reloadOrganizations: PropTypes.func.isRequired,
    mutateOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
}

export default Organization
