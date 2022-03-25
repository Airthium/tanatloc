/** @module Components.Assets.Organization.Users */

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
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
  // State
  const [scrollAdmin, setScrollAdmin]: [
    { y: number },
    Dispatch<SetStateAction<{ y: number }>>
  ] = useState(null)
  const [scrollUsers, setScrollUsers]: [
    { y: number },
    Dispatch<SetStateAction<{ y: number }>>
  ] = useState(null)

  // Ref
  const refTableAdmin = useRef(null)
  const refTableUsers = useRef(null)

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

  const onResize = useCallback(() => {
    // Check if too many admins to display
    if (
      refTableAdmin.current.clientHeight >
      (window.innerHeight - refTableAdmin.current.offsetTop - 59) / 2
    ) {
      setScrollAdmin({
        y: (window.innerHeight - refTableAdmin.current.offsetTop - 59) / 2
      })
    } else {
      // Scroll not needed
      setScrollAdmin(null)
    }
    // Check if too many users to display
    if (
      refTableUsers.current.clientHeight >
      (window.innerHeight - refTableUsers.current.offsetTop - 59) / 2
    ) {
      setScrollAdmin({
        y: (window.innerHeight - refTableUsers.current.offsetTop - 59) / 2
      })
    } else {
      // Scroll not needed
      setScrollUsers(null)
    }
  }, [])

  // Handle window resize
  useEffect((): (() => void) => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // Set Table Scroll Limit
  useEffect(() => {
    onResize()
  }, [organization.users, organization.owners, onResize])

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
            scroll={scrollAdmin}
            ref={refTableAdmin}
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
            scroll={scrollUsers}
            ref={refTableUsers}
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
