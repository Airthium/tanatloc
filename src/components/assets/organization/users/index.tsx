/** @module Components.Assets.Organization.Users */

import { RefObject, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Card, Space, Table, TableColumnType } from 'antd'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem
} from '@/api/index.d'
import Utils from '@/lib/utils'

import Add from './add'
import Delete from './delete'

/**
 * Props
 */
export interface IProps {
  organization: Pick<
    IFrontOrganizationsItem,
    'id' | 'owners' | 'pendingowners' | 'users' | 'pendingusers'
  >
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
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
  const [scrollAdmin, setScrollAdmin] = useState<{ y: number }>()
  const [scrollUsers, setScrollUsers] = useState<{ y: number }>()

  // Ref
  const refWrapper = useRef(null)
  const refTableAdmin = useRef(null)
  const refTableUsers = useRef(null)

  // Columns
  const avatarRender = (_: any, user: IFrontOrganizationsItem['users'][0]) =>
    Utils.userToAvatar(user)
  const ownerActionsRender = (
    owner: IFrontOrganizationsItem['users'][0] & { pending?: boolean }
  ) => (
    <Delete
      disabled={organization.owners.length < 2}
      user={{
        id: owner.id,
        email: owner.email
      }}
      organization={{
        id: organization.id,
        owners: organization.owners,
        pendingowners: organization.pendingowners,
        users: organization.users,
        pendingusers: organization.pendingusers
      }}
      dBkey={owner.pending ? 'pendingowners' : 'owners'}
      swr={{
        mutateOneOrganization: swr.mutateOneOrganization
      }}
    />
  )
  const userActionsRender = (
    user: IFrontOrganizationsItem['users'][0] & { pending?: boolean }
  ) => (
    <Delete
      user={{
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      }}
      organization={{
        id: organization.id,
        owners: organization.owners,
        pendingowners: organization.pendingowners,
        users: organization.users,
        pendingusers: organization.pendingusers
      }}
      dBkey={user.pending ? 'pendingusers' : 'users'}
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
      align: 'center' as TableColumnType<any>['align'],
      fixed: 'right' as TableColumnType<any>['fixed'],
      width: 75,
      render: ownerActionsRender
    }
  ]

  const usersColumns = [
    ...columns,
    {
      key: 'actions',
      title: 'Actions',
      align: 'center' as TableColumnType<any>['align'],
      fixed: 'right' as TableColumnType<any>['fixed'],
      width: 75,
      render: userActionsRender
    }
  ]

  const onResize = useCallback(() => {
    const table = refWrapper.current as RefObject<HTMLDivElement>['current']
    if (!table) return
    const wrapperHeight = table.clientHeight - 15
    const eachSpace = wrapperHeight / 2 - 39 - 12 - 32 - 20 - 75

    const tableAdminHeight = table.clientHeight
    const tableUsersHeight = table.clientHeight

    // Check if too many admins to display
    if (tableAdminHeight > eachSpace) {
      setScrollAdmin({
        y: eachSpace
      })
    } else {
      // Scroll not needed
      setScrollAdmin(undefined)
    }

    // Check if too many users to display
    if (tableUsersHeight > eachSpace) {
      setScrollUsers({
        y: eachSpace
      })
    } else {
      // Scroll not needed
      setScrollUsers(undefined)
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
  }, [organization, onResize])

  /**
   * Render
   */
  return (
    <div ref={refWrapper} style={{ height: 'calc(100vh - 228px)' }}>
      <Space direction="vertical" className="full-width" size={20}>
        <Card title="Administrators" size="small">
          <Space direction="vertical" className="full-width" size={20}>
            <Add
              title="New administrator"
              organization={{
                id: organization.id,
                owners: organization.owners,
                pendingowners: organization.pendingowners,
                pendingusers: organization.pendingusers,
                users: organization.users
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
              dataSource={[
                ...organization.owners.map((o, index) => ({
                  ...o,
                  key: o.id || index
                })),
                ...(organization.pendingowners?.map((o, index) => ({
                  ...o,
                  pending: true,
                  key: o.id || organization.owners.length + index
                })) || [])
              ]}
              scroll={{ y: scrollAdmin?.y }}
              ref={refTableAdmin}
            />
          </Space>
        </Card>
        <Card title="Users" size="small">
          <Space direction="vertical" className="full-width" size={20}>
            <Add
              title="New user"
              organization={{
                id: organization.id,
                owners: organization.owners,
                pendingowners: organization.pendingowners,
                pendingusers: organization.pendingusers,
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
              dataSource={[
                ...(organization.users?.map((u, index) => ({
                  ...u,
                  key: u.id || index
                })) || []),
                ...(organization.pendingusers?.map((u, index) => ({
                  ...u,
                  pending: true,
                  key: u.id || organization.users?.length + index
                })) || [])
              ]}
              scroll={{ y: scrollUsers?.y }}
              ref={refTableUsers}
            />
          </Space>
        </Card>
      </Space>
    </div>
  )
}

Users.propTypes = {
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    owners: PropTypes.array.isRequired,
    pendingowners: PropTypes.array,
    users: PropTypes.array,
    pendingusers: PropTypes.array
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired
}

export default Users
