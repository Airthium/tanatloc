/** @namespace Components.Assets.Organization.Users */

import PropTypes from 'prop-types'
import { Card, Space, Table } from 'antd'

import { IOrganizationWithData, IUserWithData } from '@/lib/index.d'
import Utils from '@/lib/utils'

import Add from './add'
import Delete from './delete'

interface IProps {
  organization: IOrganizationWithData
  swr: {
    mutateOneOrganization: Function
    loadingOrganizations: boolean
  }
}

/**
 * Organization users
 * @memberof Components.Assets.Organization.Users
 * @param props Props
 * @description
 * Props list:
 * - organization (Object) Organization `{ id, owners, [users] }`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 */
const Users = ({ organization, swr }: IProps): JSX.Element => {
  // Columns
  const columns = [
    {
      key: 'avatar',
      dataIndex: 'avatar',
      // eslint-disable-next-line react/display-name
      render: (_: any, user: IUserWithData) => Utils.userToAvatar(user)
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
      // eslint-disable-next-line react/display-name
      render: (owner: IUserWithData) => (
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
      // eslint-disable-next-line react/display-name
      render: (user: IUserWithData) => (
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
            loading={swr.loadingOrganizations}
            pagination={false}
            size="small"
            scroll={{ y: 200 }}
            columns={ownersColumns}
            dataSource={organization.owners.map((o, index) => ({
              ...o,
              key: o.id || index
            }))}
          />
        </Space>
      </Card>
      <Card title="Users">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Add
            title="New user"
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
            dataSource={organization.users?.map((u, index) => ({
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
    mutateOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired
}

export default Users
