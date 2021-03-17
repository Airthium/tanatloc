import PropTypes from 'prop-types'
import { Avatar, Space, Table } from 'antd'

import Add from './add'
import Edit from './edit'
import Delete from './delete'

import Utils from '@/lib/utils'

import GroupAPI from '@/api/group'

const Groups = ({ organization, swr }) => {
  // Data
  const [
    groups,
    { addOneGroup, mutateOneGroup, delOneGroup, loadingGroups }
  ] = GroupAPI.useGroups(organization?.id || 'id')

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
      render: (u) => (
        <Avatar.Group>{u.map((user) => Utils.userToAvatar(user))}</Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space>
          <Edit
            group={record}
            organization={organization}
            swr={{
              reloadOrganizations: swr.reloadOrganizations,
              mutateOneGroup
            }}
          />
          <Delete
            group={record}
            swr={{ reloadOrganizations: swr.reloadOrganizations, delOneGroup }}
          />
        </Space>
      )
    }
  ]

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Add
        organization={organization}
        swr={{
          mutateOrganizations: swr.mutateOrganizations,
          addOneGroup
        }}
      />
      <Table
        loading={loadingGroups}
        columns={columns}
        dataSource={groups.map((g) => ({ ...g, key: g.id }))}
      />
    </Space>
  )
}

Groups.propTypes = {
  organization: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Groups
