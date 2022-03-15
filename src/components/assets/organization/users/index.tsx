/** @module Components.Assets.Organization.Users */

import PropTypes from 'prop-types'
import { Card, Space, Table } from 'antd'

import { IOrganizationWithData, IUserWithData } from '@/lib/index.d'
import Utils from '@/lib/utils'

import Add from './add'
import Delete from './delete'

/**
 * Props
 */
export interface IProps {
  organization: IOrganizationWithData
  swr: {
    mutateOneOrganization: (organization: IOrganizationWithData) => void
    loadingOrganizations: boolean
  }
}

/**
 * Organization users
 * @param props Props
 * @description
 * Props list:
 * - organization (Object) Organization `{ id, owners, [users] }`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 * @returns Users
 */
const Users = ({ organization, swr }: IProps): JSX.Element => {
  // Columns
  const avatarRender = (_: any, user: IUserWithData) => Utils.userToAvatar(user)
  const ownerActionsRender = (owner: IUserWithData) => (
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
  const userActionsRender = (user: IUserWithData) => (
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
  const columns = [
    {
      key: 'avatar',
      dataIndex: 'avatar',
      render: avatarRender
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
      render: ownerActionsRender
    }
  ]

  const usersColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Actions',
      render: userActionsRender
    }
  ]

  /**
   * Render
   */
  return (
    <Space direction="vertical" className="full-width" size={20}>
      <Card title="Administrators">
        <Space direction="vertical" className="full-width" size={20}>
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
            columns={ownersColumns}
            dataSource={organization.owners.map((o, index) => ({
              ...o,
              key: o.id || index
            }))}
          />
        </Space>
      </Card>
      <Card title="Users">
        <Space direction="vertical" className="full-width" size={20}>
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
