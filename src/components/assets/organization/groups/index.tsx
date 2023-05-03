/** @module Components.Assets.Organization.Groups */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Avatar, Space, Table } from 'antd'

import Group, { Delete } from '@/components/assets/group'
import { ErrorNotification } from '@/components/assets/notification'

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
const Groups = ({ organization, swr }: IProps): JSX.Element => {
  // State
  const [userOptions, setUserOptions] = useState<
    { label: string; value: string }[]
  >([])

  const [scroll, setScroll] = useState<{ y: number } | null>(null)

  // Ref
  const refTableGroup = useRef<HTMLDivElement>(null)

  // Data
  const [
    groups,
    { addOneGroup, mutateOneGroup, delOneGroup, errorGroups, loadingGroups }
  ] = GroupAPI.useGroups(organization.id)

  // User options
  useEffect(() => {
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
    setUserOptions(options)
  }, [organization])

  // Groups error
  useEffect(() => {
    if (errorGroups) ErrorNotification(errors.groups, errorGroups)
  }, [errorGroups])

  // Columns
  const usersRender = useCallback(
    (u: IFrontGroupsItem['users']) => (
      <Avatar.Group maxCount={5}>
        {u.map((user) => Utils.userToAvatar(user))}
      </Avatar.Group>
    ),
    []
  )

  const actionsRender = useCallback(
    (_: any, group: IFrontGroupsItem) => (
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
        key: 'name'
      },
      {
        title: 'Users',
        dataIndex: 'users',
        key: 'users',
        render: usersRender
      },
      {
        title: 'Actions',
        key: 'actions',
        render: actionsRender
      }
    ],
    [usersRender, actionsRender]
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
        scroll={{ y: scroll?.y }}
        ref={refTableGroup}
      />
    </Space>
  )
}

export default Groups
