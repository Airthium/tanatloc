import PropTypes from 'prop-types'
import { Card, Space, Table } from 'antd'

import Utils from '@/lib/utils'

import Add from './add'
import Delete from './delete'

/**
 * Organization users
 * @memberof module:components/organizations
 * @param {Object} props Props
 */
const Users = ({ organization, swr }) => {
  // Data
  const columns = [
    {
      key: 'avatar',
      dataIndex: 'avatar',
      render: (_, record) => Utils.userToAvatar(record)
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
          disabled={organization?.owners?.length < 2}
          user={owner}
          dBkey="owners"
          organization={organization}
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
          user={user}
          dBkey="users"
          organization={organization}
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
            dBkey="owners"
            organization={organization}
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
            dBkey="users"
            organization={organization}
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
  organization: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Users
