import { useState } from 'react'
import { Button, Card, Space, Table } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import UserForm from './userForm'

import OrganizationAPI from '@/api/organization'

const errors = {
  addError: 'Unable to add user',
  delError: 'Unable to delete user'
}

/**
 * Organization users
 * @param {Object} props Props
 */
const Users = ({ organization, swr }) => {
  // State
  const [adding, setAdding] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Data
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

  const ownersColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Actions',
      render: (owner) => (
        <Button
          loading={deleting}
          disabled={organization?.owners?.length < 2}
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => onDel('owners', owner.id)}
        />
      )
    }
  ]

  const usersColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Actions',
      render: (user) => (
        <Button
          loading={deleting}
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => onDel('users', user.id)}
        />
      )
    }
  ]

  /**
   * On add
   * @param {string} type Type (owners or users)
   * @param {Object} values Values { email }
   */
  const onAdd = async (type, values) => {
    setAdding(true)

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
      newOrganization[type].push(values.email)
      swr.mutateOneOrganization(newOrganization)
    } catch (err) {
      Error(errors.addError, err)
    } finally {
      setAdding(false)
    }
  }

  const onDel = async (type, id) => {
    setDeleting(true)
    try {
      // API
      await OrganizationAPI.update(organization.id, [
        {
          key: type,
          type: 'array',
          method: 'remove',
          value: id
        }
      ])

      // Local
      const newOrganization = { ...organization }
      newOrganization[type] = newOrganization[type].filter((u) => u.id !== id)
      swr.mutateOneOrganization(newOrganization)
    } catch (err) {
      Error(errors.delError, err)
    } finally {
      setDeleting(false)
    }
  }

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Administrators">
        <UserForm
          loading={adding}
          type="owners"
          label="Administrator email"
          onAdd={onAdd}
        />
        <Table
          columns={ownersColumns}
          dataSource={organization?.owners?.map((o) => ({
            ...o,
            key: o.id
          }))}
        />
      </Card>
      <Card title="Users">
        <UserForm
          loading={adding}
          type="users"
          label="User email"
          onAdd={onAdd}
        />
        <Table
          columns={usersColumns}
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
