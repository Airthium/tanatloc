/** @module Components.Administration.Users */

import PropTypes from 'prop-types'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Badge, Table, Space, TableColumnsType } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import { IClientPlugin } from '@/database/index.d'
import { IUserWithData } from '@/lib/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'

import Add from './add'
import Edit from './edit'
import Delete from './delete'

/**
 * Props
 */
export interface IProps {
  users: IUserWithData[]
  swr: {
    addOneUser: (user: IUserWithData) => void
    delOneUser: (user: IUserWithData) => void
    mutateOneUser: (user: IUserWithData) => void
  }
}

/**
 * Errors
 */
const errors = {
  plugins: 'Unable to load plugins'
}

/**
 * Users
 * @param props Props
 * @returns Users
 */
const Users = ({ users, swr }: IProps): JSX.Element => {
  // State
  const [plugins, setPlugins]: [
    IClientPlugin[],
    Dispatch<SetStateAction<IClientPlugin[]>>
  ] = useState()

  // Data
  const authorizedpluginsRender = (authorizedplugins: string[]) => {
    if (authorizedplugins) {
      authorizedplugins.sort()
      return (
        <Space wrap={true}>
          {authorizedplugins.map((authorizedplugin) => {
            const plugin = plugins?.find((p) => p.key === authorizedplugin)
            if (!plugin) return
            else
              return (
                <Badge
                  key={authorizedplugin}
                  size="small"
                  count={plugin.category}
                  offset={[5, -5]}
                >
                  {plugin.name}
                </Badge>
              )
          })}
        </Space>
      )
    }
  }

  const superuserRender = (superuser: boolean) =>
    superuser && <CheckOutlined className="color-green" />

  const actionsRender = (_: any, record: IUserWithData) => (
    <Space>
      <Edit
        plugins={
          plugins?.map((plugin) => ({
            key: plugin.key,
            name: plugin.name
          })) || []
        }
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

  const columns: TableColumnsType = [
    {
      title: 'First name',
      dataIndex: 'firstname',
      key: 'firstname',
      sorter: (a: { firstname?: string }, b: { firstname?: string }) => {
        const fa = a.firstname || ''
        const fb = b.firstname || ''
        return fa.localeCompare(fb)
      }
    },
    {
      title: 'Last name',
      dataIndex: 'lastname',
      key: 'lastname',
      sorter: (a: { lastname?: string }, b: { lastname?: string }) => {
        const la = a.lastname || ''
        const lb = b.lastname || ''
        return la.localeCompare(lb)
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: { email: string }, b: { email: string }) => {
        const ea = a.email || ''
        const eb = b.email || ''
        return ea.localeCompare(eb)
      }
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

      render: authorizedpluginsRender
    },
    {
      title: 'Administrator',
      dataIndex: 'superuser',
      key: 'superuser',
      render: superuserRender
    },
    {
      title: 'Actions',
      key: 'actions',
      render: actionsRender
    }
  ]

  // Plugins list
  useEffect(() => {
    PluginsAPI.completeList()
      .then((list) => {
        setPlugins(list)
      })
      .catch((err) => {
        ErrorNotification(errors.plugins, err)
      })
  }, [])

  /**
   * Render
   */
  return (
    <Space direction="vertical" className="full-width">
      <Add
        plugins={
          plugins?.map((plugin) => ({
            key: plugin.key,
            name: plugin.name
          })) || []
        }
        swr={{
          addOneUser: swr.addOneUser
        }}
      />
      <Table
        loading={!plugins}
        pagination={false}
        size="small"
        columns={columns}
        dataSource={users.map((u) => ({ ...u, key: u.id }))}
      />
    </Space>
  )
}

Users.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      firstname: PropTypes.string,
      lastname: PropTypes.string,
      authorizedplugins: PropTypes.arrayOf(PropTypes.string).isRequired,
      superuser: PropTypes.bool.isRequired
    }).isRequired
  ).isRequired,
  swr: PropTypes.exact({
    addOneUser: PropTypes.func.isRequired,
    delOneUser: PropTypes.func.isRequired,
    mutateOneUser: PropTypes.func.isRequired
  })
}

export default Users
