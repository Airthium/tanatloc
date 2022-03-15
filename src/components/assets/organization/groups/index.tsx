/** @module Components.Assets.Organization.Groups */

import PropTypes from 'prop-types'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
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
const Groups = ({ organization }: IProps): JSX.Element => {
  // State
  const [userOptions, setUserOptions]: [
    { label: string; value: string }[],
    Dispatch<SetStateAction<{ label: string; value: string }[]>>
  ] = useState([])

  // Data
  const [
    groups,
    { addOneGroup, mutateOneGroup, delOneGroup, errorGroups, loadingGroups }
  ] = GroupAPI.useGroups(organization.id)

  // User options
  useEffect(() => {
    const owners = organization.owners
    const users = organization?.users

    const allUsers = [...owners, ...(users || [])]

    const options = allUsers.map((user) => {
      let name = ''
      if (user.firstname || user.lastname)
        name = user.firstname + ' ' + user.lastname
      else name = user.email
      return {
        label: name,
        value: user.id
      }
    })
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
          id: organization.id
        }}
        group={{
          id: group.id,
          name: group.name,
          users: group.users
        }}
        swr={{
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

  /**
   * Render
   */
  return (
    <Space direction="vertical" className="full-width" size={20}>
      <Group
        userOptions={userOptions}
        organization={{ id: organization.id }}
        swr={{
          addOneGroup
        }}
      />
      <Table
        loading={loadingGroups}
        pagination={false}
        size="small"
        columns={columns}
        dataSource={groups.map((g) => ({ key: g.id, ...g }))}
      />
    </Space>
  )
}

Groups.propTypes = {
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    owners: PropTypes.array.isRequired,
    users: PropTypes.array
  }).isRequired
}

export default Groups
