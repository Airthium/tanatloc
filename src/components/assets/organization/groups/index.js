import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Avatar, Space, Select, Table } from 'antd'

import Group, { Delete } from '@/components/assets/group'
import { Error as ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import GroupAPI from '@/api/group'

/**
 * Errors organization/groups
 * @memberof module:components/assets/organization
 */
const errors = {
  groups: 'Groups error'
}

/**
 * Groups
 * @memberof module:components/assets/organization
 * @param {Object} props Props
 *
 * @description
 * Props:
 * - organization: Organization `{ id, owners, [users] }`
 */
const Groups = ({ organization }) => {
  // State
  const [userOptions, setUserOptions] = useState([])

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

    const options = allUsers.map((user, index) => {
      let name = ''
      if (user.firstname || user.lastname)
        name = user.firstname + ' ' + user.lastname
      else name = user.email
      return <Select.Option key={user.id || index}>{name}</Select.Option>
    })
    setUserOptions(options)
  }, [organization])

  // Groups error
  useEffect(() => {
    if (errorGroups) ErrorNotification(errors.groups, errorGroups)
  }, [errorGroups])

  // Columns
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
      // eslint-disable-next-line react/display-name
      render: (u) => (
        <Avatar.Group maxCount={5}>
          {u.map((user) => Utils.userToAvatar(user))}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      // eslint-disable-next-line react/display-name
      render: (_, group) => (
        <Space direction="">
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
    }
  ]

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
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
        scroll={{ y: 'calc(100vh - 312px)' }}
        columns={columns}
        dataSource={groups.map((g) => ({ ...g, key: g.id }))}
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
