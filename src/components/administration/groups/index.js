import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Avatar, Select, Space, Table } from 'antd'

import Group, { Delete } from '@/components/assets/group'
import { Error } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import GroupAPI from '@/api/group'

/**
 * Errors administration/groups
 * @memberof module:components/administration
 */
const errors = {
  groups: 'Groups error'
}

/**
 * Groups
 * @memberof module:components/administration
 * @param {Object} props Props
 */
const Groups = ({ users }) => {
  // State
  const [userOptions, setUserOptions] = useState([])

  // Data
  const [groups, { mutateOneGroup, delOneGroup, errorGroups, loadingGroups }] =
    GroupAPI.useGroups()

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (u) => (
        <Avatar.Group maxCount={5}>
          {u.map((user) => Utils.userToAvatar(user))}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space direction="">
          <Group
            userOptions={userOptions}
            group={record}
            swr={{ mutateOneGroup }}
          />
          <Delete group={record} swr={{ delOneGroup }} />
        </Space>
      )
    }
  ]

  // User options
  useEffect(() => {
    const options = users.map((user) => {
      let name = ''
      if (user.firstname || user.lastname)
        name = user.firstname + ' ' + user.lastname
      else name = user.email
      return <Select.Option key={user.id}>{name}</Select.Option>
    })
    setUserOptions(options)
  }, [users])

  useEffect(() => {
    if (errorGroups) Error(errors.groups, errorGroups)
  }, [errorGroups])

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Table
        loading={loadingGroups}
        pagination={false}
        size="small"
        scroll={{ y: 'calc(100vh - 276px)' }}
        columns={columns}
        dataSource={groups.map((g) => ({ ...g, key: g.id }))}
      />
    </Space>
  )
}

Groups.propTypes = {
  users: PropTypes.array.isRequired
}

export default Groups
