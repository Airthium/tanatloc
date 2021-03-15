import { Button, Tabs, Typography } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import Users from './users'

import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

const errors = {
  nameError: "Unable to update organization's name",
  updateError: 'Unable to update organization'
}

/**
 * Organization
 * @param {Object} props Props
 */
const Organization = ({ organization, onClose }) => {
  // Data
  const [, { mutateOneOrganization }] = OrganizationAPI.useOrganizations()

  /**
   * On name
   * @param {string} name Name
   */
  const onName = async (name) => {
    try {
      // API
      await OrganizationAPI.update({ id: organization.id }, [
        {
          key: 'name',
          value: name
        }
      ])

      // Local
      mutateOneOrganization({
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
          <Users organization={organization} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Groups" key="groups">
          TODO
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}

export default Organization
