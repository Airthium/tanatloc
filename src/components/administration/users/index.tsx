/** @namespace Components.Administration.Users */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Badge, Table, Space, Spin, TableColumnsType } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import { IClientPlugin } from '@/database/index.d'
import { IUserWithData } from '@/lib/index.d'

import { Error as ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'

import Add from './add'
import Edit from './edit'
import Delete from './delete'

export interface IProps {
  users: Array<IUserWithData>
  swr: {
    addOneUser: Function
    delOneUser: Function
    mutateOneUser: Function
  }
}

/**
 * Errors
 * @memberof Components.Administration.Users
 */
const errors = {
  plugins: 'Unable to load plugins'
}

/**
 * Users
 * @memberof Components.Administration.Users
 * @param props Props
 */
const Users = ({ users, swr }: IProps): JSX.Element => {
  const [plugins, setPlugins]: [IClientPlugin[], Function] = useState([])
  const [columns, setColumns]: [TableColumnsType, Function] = useState([])

  useEffect(() => {
    PluginsAPI.completeList()
      .then((list) => {
        setPlugins(list)

        setColumns([
          {
            title: 'First name',
            dataIndex: 'firstname',
            key: 'firstname',
            sorter: (a: { firstname: any }, b: { firstname: any }) =>
              a.firstname - b.firstname
          },
          {
            title: 'Last name',
            dataIndex: 'lastname',
            key: 'lastname',
            sorter: (a: { lastname: any }, b: { lastname: any }) =>
              a.lastname - b.lastname
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            sorter: (a: { email: any }, b: { email: any }) => a.email - b.email
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
            // eslint-disable-next-line react/display-name
            render: (authorizedplugins: string[]) => (
              <Space wrap={true}>
                {authorizedplugins?.sort().map((authorizedplugin) => {
                  if (!list) return <Spin />
                  const plugin = list.find((p) => p.key === authorizedplugin)
                  return (
                    <Badge
                      key={authorizedplugin}
                      size="small"
                      count={plugin?.category}
                      offset={[5, -5]}
                    >
                      {plugin?.name}
                    </Badge>
                  )
                })}
              </Space>
            )
          },
          {
            title: 'Administrator',
            dataIndex: 'superuser',
            key: 'superuser',
            // eslint-disable-next-line react/display-name
            render: (superuser: boolean) =>
              superuser && <CheckOutlined style={{ color: 'green' }} />
          },
          {
            title: 'Actions',
            key: 'actions',
            // eslint-disable-next-line react/display-name
            render: (_: any, record: IUserWithData) => (
              <Space>
                <Edit
                  plugins={list || []}
                  user={{
                    id: record.id,
                    firstname: record.firstname,
                    lastname: record.lastname,
                    email: record.email,
                    authorizedplugins: record.authorizedplugins,
                    superuser: record.superuser
                  }}
                  swr={{ mutateOneUser: swr.mutateOneUser }}
                />
                <Delete
                  user={{ id: record.id, email: record.email }}
                  swr={{ delOneUser: swr.delOneUser }}
                />
              </Space>
            )
          }
        ])
      })
      .catch((err) => {
        ErrorNotification(errors.plugins, err)
      })
  }, [])

  /**
   * Render
   */
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Add
        plugins={plugins || []}
        swr={{
          addOneUser: swr.addOneUser
        }}
      />
      <Table
        loading={!columns}
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
  swr: PropTypes.exact({
    addOneUser: PropTypes.func.isRequired,
    delOneUser: PropTypes.func.isRequired,
    mutateOneUser: PropTypes.func.isRequired
  })
}

export default Users
