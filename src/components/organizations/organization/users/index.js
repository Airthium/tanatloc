import { Button, Card, Space, Table } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import UserForm from './userForm'

import OrganizationAPI from '@/api/organization'

const errors = {
  addError: 'Unable to add an user'
}

/**
 * Organization users
 * @param {Object} props Props
 */
const Users = ({ organization }) => {
  // Data
  const [, { mutateOneOrganization }] = OrganizationAPI.useOrganizations()

  const columns = [
    {
      key: 'lastname',
      title: 'Lastname',
      dataIndex: 'lastname'
    },
    {
      key: 'firstname',
      title: 'Firstname',
      dataIndex: 'firstname'
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email'
    }
  ]

  const ownerColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Actions',
      render: (owner) => (
        <Button
          disabled={organization?.owners?.length < 2}
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => delOwner(owner)}
        />
      )
    }
  ]

  const userColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Actions',
      render: (user) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => delUser(user)}
        />
      )
    }
  ]

  const onAdd = async (type, values) => {
    try {
      // API
      await OrganizationAPI.update(organization.id, [
        {
          key: type,
          type: 'array',
          method: 'append',
          value: values.email
        }
      ])

      // Local
      const newOrganization = { ...organization }
      organization[type].push(values.email)
      mutateOneOrganization(newOrganization)
    } catch (err) {
      Error(errors.addError, err)
    }
  }

  const delOwner = async (owner) => {}

  const delUser = async (user) => {}

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Administrators">
        <UserForm type="owners" label="Administrator email" onAdd={onAdd} />
        <Table
          columns={ownerColumns}
          dataSource={organization?.owners?.map((o) => ({
            ...o,
            key: o.id
          }))}
        />
      </Card>
      <Card title="Users">
        <UserForm type="users" label="User email" onAdd={onAdd} />
        <Table
          columns={userColumns}
          dataSource={organization?.users?.map((u) => ({
            ...u,
            key: u.id
          }))}
        />
      </Card>
    </Space>
  )
}

export default Users
