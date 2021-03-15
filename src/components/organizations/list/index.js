import { Avatar, Button, Space, Spin, Table } from 'antd'
import { ControlOutlined } from '@ant-design/icons'

import Delete from '../delete'

import OrganizationAPI from '@/api/organization'

import Utils from '@/lib/utils'

/**
 * List
 * @memberof module:components/organizations
 */
const List = ({ setOrganization }) => {
  // Data
  const [
    organizations,
    { loadingOrganizations }
  ] = OrganizationAPI.useOrganizations()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name
    },
    {
      title: 'Administrators',
      dataIndex: 'owners',
      key: 'owners',
      render: (owners) => (
        <Avatar.Group>
          {owners?.map((owner) => Utils.userToAvatar(owner))}
        </Avatar.Group>
      )
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (users) => (
        <Avatar.Group>
          {users?.map((user) => Utils.userToAvatar(user))}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (org) => (
        <Space wrap={true}>
          <Button
            icon={<ControlOutlined />}
            onClick={() => setOrganization(org)}
          />
          <Delete organization={org} />
        </Space>
      )
    }
  ]

  return loadingOrganizations ? (
    <Spin />
  ) : (
    <Table
      columns={columns}
      dataSource={organizations?.map((o) => ({ ...o, key: o.id }))}
    />
  )
}

export default List
