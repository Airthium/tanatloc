import { useState } from 'react'
import { Avatar, Button, Drawer, Space, Table } from 'antd'
import { ControlOutlined, DeleteOutlined } from '@ant-design/icons'

import Organization from '../organization'
import Delete from '../delete'

import OrganizationAPI from '@/api/organization'

import Utils from '@/lib/utils'

/**
 * List
 * @memberof module:components/organizations
 */
const List = () => {
  // State
  const [visible, setVisible] = useState(false)
  const [organization, setOrganization] = useState()

  // Data
  const [organizations] = OrganizationAPI.useOrganizations()
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
        <Avatar.Group>
          {owners?.map((owner) => Utils.userToAvatar(owner))}
        </Avatar.Group>
      )
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: (users) => (
        <Avatar.Group>
          {users?.map((user) => Utils.userToAvatar(user))}
        </Avatar.Group>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (org) => (
        <Space wrap={true}>
          <Button icon={<ControlOutlined />} onClick={() => onOpen(org)} />
          <Delete organization={org} />
        </Space>
      )
    }
  ]

  /**
   * On open
   * @param {Object} org Organization
   */
  const onOpen = (org) => {
    setOrganization(org)
    setVisible(true)
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Table
        columns={columns}
        dataSource={organizations?.map((o) => ({ ...o, key: o.id }))}
      />
      <Drawer
        title="Organization"
        placement="right"
        closable={true}
        onClose={() => setVisible(false)}
        visible={visible}
        getContainer={false}
        style={{ position: 'absolute' }}
        width="100%"
      >
        <Organization
          organization={organization}
          onClose={() => setVisible(false)}
        />
      </Drawer>
    </div>
  )
}

export default List
