import PropTypes from 'prop-types'
import { Card, Space, Table } from 'antd'

import Add from './add'
import Delete from './delete'

import Utils from '@/lib/utils'

/**
 * Organization users
 * @memberof module:components/assets/organization
 * @param {Object} props Props
 *
 * @description
 * Props:
 * - organization: Organization `{ id, owners, [users] }`
 * - swr: SWR functions `{ mutateOneOrganization }`
 */
const Users = ({ organization, swr }) => {
  // Columns
  const columns = [
    {
      key: 'avatar',
      dataIndex: 'avatar',
      render: (_, user) => Utils.userToAvatar(user)
    },
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
        <Delete
          disabled={organization.owners.length < 2}
          user={{
            id: owner.id,
            email: owner.email
          }}
          organization={{
            id: organization.id,
            owners: organization.owners
          }}
          dBkey="owners"
          swr={{
            mutateOneOrganization: swr.mutateOneOrganization
          }}
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
        <Delete
          user={{
            id: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname
          }}
          organization={{
            id: organization.id,
            users: organization.users
          }}
          dBkey="users"
          swr={{
            mutateOneOrganization: swr.mutateOneOrganization
          }}
        />
      )
    }
  ]

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Administrators">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Add
            title="New administrator"
            organization={{
              id: organization.id,
              owners: organization.owners
            }}
            dBkey="owners"
            swr={{
              mutateOneOrganization: swr.mutateOneOrganization
            }}
          />
          <Table
            loading={swr?.loadingOrganizations}
            pagination={false}
            size="small"
            scroll={{ y: 200 }}
            columns={ownersColumns}
            dataSource={organization?.owners?.map((o, index) => ({
              ...o,
              key: o.id || index
            }))}
          />
        </Space>
      </Card>
      <Card title="Users">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Add
            title="New uers"
            organization={{
              id: organization.id,
              users: organization.users
            }}
            dBkey="users"
            swr={{
              mutateOneOrganization: swr.mutateOneOrganization
            }}
          />
          <Table
            loading={swr?.loadingOrganizations}
            pagination={false}
            size="small"
            scroll={{ y: 200 }}
            columns={usersColumns}
            dataSource={organization?.users?.map((u, index) => ({
              ...u,
              key: u.id || index
            }))}
          />
        </Space>
      </Card>
    </Space>
  )
}

Users.popTypes = {
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    owners: PropTypes.array.isRequired,
    users: PropTypes.array
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Users
