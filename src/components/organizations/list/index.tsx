import PropTypes from 'prop-types'
import { Avatar, Button, Space, Table } from 'antd'
import { ControlOutlined } from '@ant-design/icons'

import {
  IGroupWithData,
  IOrganizationWithData,
  IUserWithData
} from '@/lib/index.d'

import Delete from '../delete'

import Utils from '@/lib/utils'

export interface IProps {
  user: IUserWithData
  organizations: IOrganizationWithData[]
  swr: {
    delOneOrganization: Function
    loadingOrganizations: boolean
  }
  setOrganization: Function
}

/**
 * List
 * @memberof Components.Organizations
 * @param props Props
 */
const List = ({
  user,
  organizations,
  swr,
  setOrganization
}: IProps): JSX.Element => {
  // Data
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: { name: string }, b: { name: string }) =>
        parseInt(a.name) - parseInt(b.name)
    },
    {
      title: 'Administrators',
      dataIndex: 'owners',
      key: 'owners',
      // eslint-disable-next-line react/display-name
      render: (owners: IUserWithData[]) => (
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
      render: (users: IUserWithData[]) => (
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
      render: (groups: IGroupWithData[]) => (
        <Avatar.Group maxCount={5}>
          {groups?.map((g) => Utils.groupToAvatar(g))}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      // eslint-disable-next-line react/display-name
      render: (org: IOrganizationWithData) => {
        if (org.owners.find((o) => o.id === user.id))
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
      loading={swr.loadingOrganizations}
      pagination={false}
      size="small"
      scroll={{ y: 'calc(100vh - 206px)' }}
      columns={columns}
      dataSource={organizations?.map((organization) => ({
        key: organization.id,
        name: organization.name,
        owners: organization.owners,
        users: organization.users,
        groups: organization.groups
      }))}
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
