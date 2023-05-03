/** @module Components.Administration.Users */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Badge,
  Table,
  Space,
  TableColumnsType,
  Popover,
  Button,
  Card
} from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { ColumnGroupType } from 'antd/lib/table'

import {
  IFrontUsersItem,
  IFrontNewUser,
  IFrontMutateUsersItem
} from '@/api/index.d'
import { IClientPlugin } from '@/plugins/index.d'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { ErrorNotification } from '@/components/assets/notification'

import PluginsAPI from '@/api/plugins'

import Add from './add'
import Edit from './edit'
import Delete from './delete'

import globalStyle from '@/styles/index.module.css'

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
    addOneUser: (user: IFrontNewUser) => Promise<void>
    delOneUser: (user: IFrontMutateUsersItem) => Promise<void>
    mutateOneUser: (user: IFrontMutateUsersItem) => Promise<void>
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
  // Ref
  const refTable = useRef<HTMLDivElement>(null)

  // State
  const [plugins, setPlugins] = useState<IClientPlugin[]>()
  const [scroll, setScroll] = useState<{ y: number }>()

  // Data
  const authorizedpluginsRender = useCallback(
    (authorizedplugins: string[]) => {
      authorizedplugins.sort()
      const list = authorizedplugins.map((authorizedplugin) => {
        const plugin = plugins?.find((p) => p.key === authorizedplugin)
        if (!plugin) return
        else
          return (
            <Badge.Ribbon
              key={authorizedplugin}
              text={plugin.category}
              style={{ marginTop: '-15px' }}
            >
              <Card size="small">{plugin.name}</Card>
            </Badge.Ribbon>
          )
      })
      const content = <Space direction="vertical">{list}</Space>
      return (
        <Popover content={content}>
          <Button>{list.length} plugins</Button>
        </Popover>
      )
    },
    [plugins]
  )

  const superuserRender = useCallback(
    (superuser: boolean) =>
      superuser && <CheckOutlined className={globalStyle.textGreen} />,
    []
  )

  const actionsRender = useCallback(
    (_: any, record: TUserItem) => (
      <Space>
        <Edit
          plugins={
            plugins?.map((plugin) => ({
              key: plugin.key,
              name: plugin.name
            })) ?? []
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
    ),
    [plugins, swr]
  )

  const columns: TableColumnsType<TUserItem> = useMemo(
    () => [
      {
        title: 'First name',
        dataIndex: 'firstname',
        key: 'firstname',
        sorter: (a: { firstname?: string }, b: { firstname?: string }) => {
          const fa = a.firstname ?? ''
          const fb = b.firstname ?? ''
          return fa.localeCompare(fb)
        }
      },
      {
        title: 'Last name',
        dataIndex: 'lastname',
        key: 'lastname',
        sorter: (a: { lastname?: string }, b: { lastname?: string }) => {
          const la = a.lastname ?? ''
          const lb = b.lastname ?? ''
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
        align: 'center',
        render: superuserRender
      },
      {
        title: 'Actions',
        key: 'actions',
        render: actionsRender
      }
    ],
    [authorizedpluginsRender, superuserRender, actionsRender]
  )

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

  // Handle window resize
  useCustomEffect(
    () => {
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('resize', onResize)
      }
    },
    undefined,
    [onResize]
  )

  // Set Table Scroll Limit
  useCustomEffect(
    () => {
      onResize()
    },
    [users],
    [onResize]
  )

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
    <Space
      direction="vertical"
      className={`${globalStyle.fullWidth} ${globalStyle.fullHeight}`}
      size={20}
    >
      <Add
        plugins={
          plugins?.map((plugin) => ({
            key: plugin.key,
            name: plugin.name
          })) ?? []
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
