import PropTypes from 'prop-types'
import { Avatar, Button, Space, Table } from 'antd'
import { ControlOutlined } from '@ant-design/icons'

import Delete from '../delete'

import Utils from '@/lib/utils'

/**
 * List
 * @memberof module:components/organizations
 * @param {Object} props Props
 */
const List = ({ user, swr, setOrganization }) => {
  // Data
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name - b.name
    },
    {
      title: 'Administrators',
      dataIndex: 'owners',
      key: 'owners',
      render: (owners) => (
        <Avatar.Group>{owners?.map((o) => Utils.userToAvatar(o))}</Avatar.Group>
      )
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (users) => (
        <Avatar.Group>{users?.map((u) => Utils.userToAvatar(u))}</Avatar.Group>
      )
    },
    {
      title: 'Groups',
      dataIndex: 'groups',
      key: 'groups',
      render: (groups) => (
        <Avatar.Group>
          {groups?.map((g) => Utils.groupToAvatar(g))}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (org) => {
        if (org.owners.includes(user.id))
          return (
            <Space wrap={true}>
              <Button
                icon={<ControlOutlined />}
                onClick={() => setOrganization(org)}
              >
                Manage
              </Button>
              <Delete
                organization={org}
                swr={{ delOneOrganization: swr.delOneOrganization }}
              />
            </Space>
          )
      }
    }
  ]

  /**
   * Render
   */
  return (
    <Table
      loading={swr?.loadingOrganizations}
      columns={columns}
      dataSource={swr?.organizations?.map((o) => ({ ...o, key: o.id }))}
    />
  )
}

List.propTypes = {
  user: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired,
  setOrganization: PropTypes.func.isRequired
}

export default List
