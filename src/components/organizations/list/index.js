import { Avatar, Button, Space, Table } from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'

import OrganizationAPI from '@/api/organization'

import Utils from '@/lib/utils'

const List = () => {
  // Data
  const [organizations] = OrganizationAPI.useOrganizations()
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
      render: () => (
        <Space wrap={true}>
          <Button icon={<EditOutlined />} />
          <Button icon={<DeleteOutlined />} type="danger" />
        </Space>
      )
    }
  ]

  return <Table columns={columns} dataSource={organizations} />
}

export default List
