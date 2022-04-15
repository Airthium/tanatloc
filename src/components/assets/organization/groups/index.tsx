/** @module Components.Assets.Organization.Groups */

import PropTypes from 'prop-types'
import { useState, useEffect, useCallback, useRef, RefObject } from 'react'
import { Avatar, Space, Table } from 'antd'

import {
  IGroupWithData,
  IOrganizationWithData,
  IUserWithData
} from '@/lib/index.d'

import Group, { Delete } from '@/components/assets/group'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import GroupAPI from '@/api/group'

/**
 * Props
 */
export interface IProps {
  organization: IOrganizationWithData
  swr: {
    mutateOneOrganization: (organization: IOrganizationWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  groups: 'Groups error'
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
  const refTableGroup = useRef(null)

  // Data
  const [
    groups,
    { addOneGroup, mutateOneGroup, delOneGroup, errorGroups, loadingGroups }
  ] = GroupAPI.useGroups(organization.id)

  // User options
  useEffect(() => {
    const owners = organization.owners
    const users = organization?.users

    const allUsers = [...(owners as IUserWithData[]), ...(users || [])]

    const options = allUsers.map((user) => {
      let name = ''
      if (user.firstname || user.lastname)
        name = user.firstname + ' ' + user.lastname
      else name = user.email as string
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
  const usersRender = (u: IUserWithData[]) => (
    <Avatar.Group maxCount={5}>
      {u.map((user) => Utils.userToAvatar(user))}
    </Avatar.Group>
  )
  const actionsRender = (_: any, group: IGroupWithData) => (
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
  )
  const columns = [
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
  ]

  // Update table scroll
  const onResize = useCallback(() => {
    // Check if too many groups to display
    const table = refTableGroup.current as RefObject<HTMLDivElement>['current']
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
    <Space direction="vertical" className="full-width" size={20}>
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

Groups.propTypes = {
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    owners: PropTypes.array.isRequired,
    users: PropTypes.array,
    groups: PropTypes.array.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Groups
