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
const List = ({ user, organizations, swr, setOrganization }) => {
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
      // eslint-disable-next-line react/display-name
      render: (owners) => (
        <Avatar.Group maxCount={5}>
          {owners?.map((o) => Utils.userToAvatar(o))}
        </Avatar.Group>
      )
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      // eslint-disable-next-line react/display-name
      render: (users) => (
        <Avatar.Group maxCount={5}>
          {users?.map((u) => Utils.userToAvatar(u))}
        </Avatar.Group>
      )
    },
    {
      title: 'Groups',
      dataIndex: 'groups',
      key: 'groups',
      // eslint-disable-next-line react/display-name
      render: (groups) => (
        <Avatar.Group maxCount={5}>
          {groups?.map((g) => Utils.groupToAvatar(g))}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      // eslint-disable-next-line react/display-name
      render: (org) => {
        if (org.owners.find((o) => o.id === user.id))
          return (
            <Space direction="" wrap={true}>
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
      pagination={false}
      size="small"
      scroll={{ y: 'calc(100vh - 206px)' }}
      columns={columns}
      dataSource={organizations?.map((o) => ({ ...o, key: o.id }))}
    />
  )
}

List.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    delOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired,
  setOrganization: PropTypes.func.isRequired
}

export default List
