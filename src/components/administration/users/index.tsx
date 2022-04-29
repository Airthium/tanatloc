/** @module Components.Administration.Users */

import PropTypes from 'prop-types'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Badge, Table, Space, TableColumnsType } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import { IClientPlugin } from '@/plugins/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import {
  IFrontUsersItem,
  IFrontNewUser,
  IFrontMutateUsersItem
} from '@/api/index.d'
import PluginsAPI from '@/api/plugins'

import Add from './add'
import Edit from './edit'
import Delete from './delete'
import { ColumnGroupType } from 'antd/lib/table'

/**
 * Custom Types
 */
export type TUserItem = Pick<
  IFrontUsersItem,
  'id' | 'email' | 'firstname' | 'lastname' | 'authorizedplugins' | 'superuser'
>

/**
 * Props
 */
export interface IProps {
  users: TUserItem[]
  swr: {
    addOneUser: (user: IFrontNewUser) => void
    delOneUser: (user: IFrontMutateUsersItem) => void
    mutateOneUser: (user: IFrontMutateUsersItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  plugins: 'Unable to load plugins'
}

/**
 * Users
 * @param props Props
 * @returns Users
 */
const Users = ({ users, swr }: IProps): JSX.Element => {
  // State
  const [plugins, setPlugins] = useState<IClientPlugin[]>()
  const [scroll, setScroll] = useState<{ y: number }>()

  // Ref
  const refTable = useRef<HTMLDivElement>(null)

  // Data
  const authorizedpluginsRender = (authorizedplugins: string[]) => {
    authorizedplugins.sort()
    return (
      <Space wrap={true}>
        {authorizedplugins.map((authorizedplugin) => {
          const plugin = plugins?.find((p) => p.key === authorizedplugin)
          if (!plugin) return
          else
            return (
              //@ts-ignore
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

  const superuserRender = (superuser: boolean) =>
    superuser && <CheckOutlined className="color-green" />

  const actionsRender = (_: any, record: TUserItem) => (
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

  const columns: TableColumnsType<TUserItem> = [
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
        const ea = a.email
        const eb = b.email
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

  /**
   * On resize
   */
  const onResize = useCallback(() => {
    // Check if too many users to display
    const table = refTable.current
    /* istanbul ignore next */
    if (!table) return
    if (table.clientHeight > window.innerHeight - table.offsetTop - 59) {
      setScroll({ y: window.innerHeight - table.offsetTop - 59 })
    } else {
      // Scroll not needed
      setScroll(undefined)
    }
  }, [])

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

  // Handle window resize
  useEffect(() => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // Set Table Scroll Limit
  useEffect(() => {
    onResize()
  }, [users, onResize])

  /**
   * Render
   */
  return (
    <Space direction="vertical" className="full-width full-height" size={20}>
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
        columns={columns as ColumnGroupType<object>[]}
        dataSource={users.map((u) => ({ ...u, key: u.id }))}
        ref={refTable}
        scroll={{ y: scroll?.y }}
      />
    </Space>
  )
}

export default Users
