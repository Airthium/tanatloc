/** @module Components.Assets.Organization.Users */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Card, Space, Table, TableColumnType } from 'antd'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem,
  IFrontGroupsItem
} from '@/api/index.d'
import Utils from '@/lib/utils'

import Add from './add'
import Delete from './delete'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  organization: Pick<
    IFrontOrganizationsItem,
    'id' | 'owners' | 'pendingowners' | 'users' | 'pendingusers'
  >
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
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
const Users = ({ organization, swr }: IProps): React.JSX.Element => {
  // State
  const [scrollAdmin, setScrollAdmin] = useState<{ y: number }>()
  const [scrollUsers, setScrollUsers] = useState<{ y: number }>()

  // Ref
  const refWrapper = useRef<HTMLDivElement>(null)
  const refTableAdmin = useRef<HTMLDivElement>(null)
  const refTableUsers = useRef<HTMLDivElement>(null)

  // Columns
  const avatarRender = useCallback(
    (_: any, user: IFrontOrganizationsItem['users'][0]) =>
      Utils.userToAvatar(user),
    []
  )

  /**
   * Workspaces render
   * @param workspaces Workspaces
   * @returns Render
   */
  const workspacesRender = useCallback(
    (workspaces: IFrontGroupsItem['workspaces']): React.JSX.Element => (
      <Avatar.Group maxCount={5}>
        {workspaces.map((workspace) => Utils.workspaceToAvatar(workspace))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Projects render
   * @param projects Projects
   * @returns Render
   */
  const projectsRender = useCallback(
    (projects: IFrontGroupsItem['projects']): React.JSX.Element => (
      <Avatar.Group maxCount={5}>
        {projects.map((project) => Utils.projectToAvatar(project))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Usermodel render
   * @param usermodels User model
   * @returns Render
   */
  const usermodelsRender = useCallback(
    (usermodels: IFrontGroupsItem['usermodels']): React.JSX.Element => (
      <Avatar.Group maxCount={5}>
        {usermodels.map((usermodel) => Utils.usermodelToAvatar(usermodel))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Owner actions render
   * @param owner Owner
   * @returns Render
   */
  const ownerActionsRender = useCallback(
    (
      owner: IFrontOrganizationsItem['users'][0] & { pending?: boolean }
    ): React.JSX.Element => (
      <Delete
        disabled={organization.owners.length < 2 && !owner.pending}
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
    ),
    [organization, swr]
  )

  /**
   * User actions render
   * @param user User
   * @returns Render
   */
  const userActionsRender = useCallback(
    (
      user: IFrontOrganizationsItem['users'][0] & { pending?: boolean }
    ): React.JSX.Element => (
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
    ),
    [organization, swr]
  )

  // Columns
  const columns = useMemo(
    () => [
      {
        key: 'avatar',
        dataIndex: 'avatar',
        align: 'center' as TableColumnType<any>['align'],
        render: avatarRender
      },
      {
        key: 'lastname',
        title: 'Lastname',
        dataIndex: 'lastname',
        align: 'center' as TableColumnType<any>['align']
      },
      {
        key: 'firstname',
        title: 'Firstname',
        dataIndex: 'firstname',
        align: 'center' as TableColumnType<any>['align']
      },
      {
        key: 'email',
        title: 'Email',
        dataIndex: 'email',
        align: 'center' as TableColumnType<any>['align']
      },
      {
        key: 'workspaces',
        title: 'Workspaces',
        dataIndex: 'workspaces',
        align: 'center' as TableColumnType<any>['align'],
        render: workspacesRender
      },
      {
        key: 'projects',
        title: 'Projects',
        dataIndex: 'projects',
        align: 'center' as TableColumnType<any>['align'],
        render: projectsRender
      },
      {
        key: 'usermodels',
        title: 'User models',
        dataIndex: 'usermodels',
        align: 'center' as TableColumnType<any>['align'],
        render: usermodelsRender
      }
    ],
    [avatarRender, workspacesRender, projectsRender, usermodelsRender]
  )

  // Owners columns
  const ownersColumns = useMemo(
    () => [
      ...columns,
      {
        key: 'actions',
        title: 'Actions',
        align: 'center' as TableColumnType<any>['align'],
        fixed: 'right' as TableColumnType<any>['fixed'],
        render: ownerActionsRender
      }
    ],
    [columns, ownerActionsRender]
  )

  // Users columns
  const usersColumns = useMemo(
    () => [
      ...columns,
      {
        key: 'actions',
        title: 'Actions',
        align: 'center' as TableColumnType<any>['align'],
        fixed: 'right' as TableColumnType<any>['fixed'],
        render: userActionsRender
      }
    ],
    [columns, userActionsRender]
  )

  /**
   * On resize
   */
  const onResize = useCallback(() => {
    const table = refWrapper.current
    /* istanbul ignore next */
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
      <Space direction="vertical" className={globalStyle.fullWidth} size={20}>
        <Card title="Administrators" size="small">
          <Space
            direction="vertical"
            className={globalStyle.fullWidth}
            size={20}
          >
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
                ...organization.owners.map((o) => ({
                  ...o,
                  key: o.id
                })),
                ...organization.pendingowners.map((o) => ({
                  ...o,
                  pending: true,
                  key: o.id
                }))
              ]}
              scroll={{ x: 1200, y: scrollAdmin?.y }}
              ref={refTableAdmin}
            />
          </Space>
        </Card>
        <Card title="Users" size="small">
          <Space
            direction="vertical"
            className={globalStyle.fullWidth}
            size={20}
          >
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
                ...organization.users.map((u) => ({
                  ...u,
                  key: u.id
                })),
                ...organization.pendingusers.map((u) => ({
                  ...u,
                  pending: true,
                  key: u.id
                }))
              ]}
              scroll={{ x: 1200, y: scrollUsers?.y }}
              ref={refTableUsers}
            />
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default Users
