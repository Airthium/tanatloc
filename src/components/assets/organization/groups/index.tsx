/** @module Components.Assets.Organization.Groups */

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  useContext,
  ReactNode
} from 'react'
import { Avatar, Space, Table, TableColumnType } from 'antd'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Group, { Delete } from '@/components/assets/group'

import Utils from '@/lib/utils'

import {
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem,
  IFrontGroupsItem
} from '@/api/index.d'
import GroupAPI from '@/api/group'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  organization: Pick<
    IFrontOrganizationsItem,
    'id' | 'owners' | 'users' | 'groups'
  >
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  groups: 'Error while loading groups'
}

/**
 * Groups
 * @param props Props
 * @description
 * Props:
 * - organization (Object) Organization `{ id, owners, [users] }`
 * @returns Groups
 */
const Groups = ({ organization, swr }: IProps): ReactNode => {
  // Ref
  const refTableGroup = useRef<any>(null)

  // State
  const [scroll, setScroll] = useState<{ y: number } | null>(null)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const [
    groups,
    { addOneGroup, mutateOneGroup, delOneGroup, errorGroups, loadingGroups }
  ] = GroupAPI.useGroups(organization.id)

  // User options
  const userOptions = useMemo(() => {
    const owners = organization.owners
    const users = organization?.users

    const allUsers = [...owners, ...users]

    const options = allUsers.map((user) => {
      let name = ''
      if (user.firstname || user.lastname)
        name = user.firstname + ' ' + user.lastname
      else name = user.email
      return {
        label: name,
        value: user.id
      }
    }) as { label: string; value: string }[]

    return options
  }, [organization])

  // Groups error
  useEffect(() => {
    if (errorGroups)
      dispatch(addError({ title: errors.groups, err: errorGroups }))
  }, [errorGroups, dispatch])

  /**
   * Users render
   * @param users Users
   * @returns Render
   */
  const usersRender = useCallback(
    (users: IFrontGroupsItem['users']): ReactNode => (
      <Avatar.Group maxCount={5}>
        {users.map((user) => Utils.userToAvatar(user))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Workspaces render
   * @param workspaces Workspaces
   * @returns Render
   */
  const workspacesRender = useCallback(
    (workspaces: IFrontGroupsItem['workspaces']): ReactNode => (
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
    (projects: IFrontGroupsItem['projects']): ReactNode => (
      <Avatar.Group maxCount={5}>
        {projects.map((project) => Utils.projectToAvatar(project))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Usermodels render
   * @param usermodels User model
   * @returns Render
   */
  const usermodelsRender = useCallback(
    (usermodels: IFrontGroupsItem['usermodels']): ReactNode => (
      <Avatar.Group maxCount={5}>
        {usermodels.map((usermodel) => Utils.usermodelToAvatar(usermodel))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Actions render
   * @param _ Unused
   * @param group Group
   * @returns Render
   */
  const actionsRender = useCallback(
    (_: any, group: IFrontGroupsItem): ReactNode => (
      <Space>
        <Group
          userOptions={userOptions}
          organization={{
            id: organization.id,
            groups: organization.groups
          }}
          group={{
            id: group.id,
            name: group.name,
            users: group.users
          }}
          swr={{
            mutateOneOrganization: swr.mutateOneOrganization,
            mutateOneGroup
          }}
        />
        <Delete
          group={{
            id: group.id,
            name: group.name
          }}
          swr={{ delOneGroup }}
        />
      </Space>
    ),
    [organization, swr, userOptions, mutateOneGroup, delOneGroup]
  )

  // Columns
  const columns = useMemo(
    () => [
      {
        title: 'Group name',
        dataIndex: 'name',
        key: 'name',
        align: 'center' as TableColumnType<any>['align']
      },
      {
        title: 'Users',
        dataIndex: 'users',
        key: 'users',
        align: 'center' as TableColumnType<any>['align'],
        render: usersRender
      },
      {
        title: 'Workspaces',
        dataIndex: 'workspaces',
        key: 'workspaces',
        align: 'center' as TableColumnType<any>['align'],
        render: workspacesRender
      },
      {
        title: 'Projects',
        dataIndex: 'projects',
        key: 'projects',
        align: 'center' as TableColumnType<any>['align'],
        render: projectsRender
      },
      {
        title: 'User models',
        dataIndex: 'usermodels',
        key: 'usermodels',
        align: 'center' as TableColumnType<any>['align'],
        render: usermodelsRender
      },
      {
        title: 'Actions',
        key: 'actions',
        align: 'center' as TableColumnType<any>['align'],
        fixed: 'right' as TableColumnType<any>['fixed'],
        render: actionsRender
      }
    ],
    [
      usersRender,
      workspacesRender,
      projectsRender,
      usermodelsRender,
      actionsRender
    ]
  )

  /**
   * On resize
   */
  const onResize = useCallback(() => {
    // Check if too many groups to display
    const table = refTableGroup.current
    /* istanbul ignore next */
    if (!table) return
    if (table.clientHeight > window.innerHeight - table.offsetTop - 59) {
      setScroll({
        y: window.innerHeight - table.offsetTop - 59
      })
    } else {
      // Scroll not needed
      setScroll(null)
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // Set Table Scroll Limit
  useEffect(() => {
    onResize()
  }, [groups, onResize])

  /**
   * Render
   */
  return (
    <Space direction="vertical" className={globalStyle.fullWidth} size={20}>
      <Group
        userOptions={userOptions}
        organization={{ id: organization.id, groups: organization.groups }}
        swr={{
          mutateOneOrganization: swr.mutateOneOrganization,
          addOneGroup
        }}
      />
      <Table
        loading={loadingGroups}
        pagination={false}
        size="small"
        columns={columns}
        dataSource={groups.map((g) => ({ key: g.id, ...g }))}
        scroll={{ x: 1200, y: scroll?.y }}
        ref={refTableGroup}
      />
    </Space>
  )
}

export default Groups
