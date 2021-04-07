import PropTypes from 'prop-types'
import { Badge, Table, Space } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import Add from './add'
import Edit from './edit'
import Delete from './delete'

import Plugins from '@/plugins'

/**
 * Users
 * @memberof module:components/administration
 * @param {Object} props Props
 */
const Users = ({ users, swr }) => {
  // Data
  const columns = [
    {
      title: 'First name',
      dataIndex: 'firstname',
      key: 'firstname',
      sorter: (a, b) => a.firstname - b.firstname
    },
    {
      title: 'Last name',
      dataIndex: 'lastname',
      key: 'lastname',
      sorter: (a, b) => a.lastname - b.lastname
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email - b.email
    },
    {
      title: 'Password',
      key: 'password',
      render: () => '******'
    },
    {
      title: 'Plugins',
      dataIndex: 'authorizedplugins',
      key: 'authorizedplugins',
      render: (plugins) => {
        return (
          <Space wrap={true}>
            {plugins?.sort().map((key) => (
              <Badge
                key={key}
                size="small"
                count={Plugins[key].category}
                offset={[5, -5]}
                style={{ backgroundColor: '#108ee9' }}
              >
                {Plugins[key].name}
              </Badge>
            ))}
          </Space>
        )
      }
    },
    {
      title: 'Administrator',
      dataIndex: 'superuser',
      key: 'superuser',
      render: (superuser) =>
        superuser && <CheckOutlined style={{ color: 'green' }} />
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space direction="">
          <Edit user={record} swr={{ mutateOneUser: swr.mutateOneUser }} />
          <Delete user={record} swr={{ delOneUser: swr.delOneUser }} />
        </Space>
      )
    }
  ]

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Add
        swr={{
          addOneUser: swr.addOneUser
        }}
      />
      <Table
        pagination={false}
        size="small"
        scroll={{ y: 'calc(100vh - 312px)' }}
        columns={columns}
        dataSource={users.map((u) => ({ ...u, key: u.id }))}
      />
    </Space>
  )
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
  swr: PropTypes.shape({
    addOneUser: PropTypes.func.isRequired,
    delOneUser: PropTypes.func.isRequired,
    mutateOneUser: PropTypes.func.isRequired
  })
}

export default Users
