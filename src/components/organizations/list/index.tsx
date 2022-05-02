/** @module Components.Organizations.List */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Avatar, Button, Space, Table, TableColumnsType } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ControlOutlined,
  LeftSquareOutlined
} from '@ant-design/icons'
import { ColumnGroupType } from 'antd/lib/table'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import {
  IFrontUser,
  IFrontUsers,
  IFrontGroups,
  IFrontOrganizations,
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem
} from '@/api/index.d'
import OrganizationAPI from '@/api/organization'

import Delete from '../delete'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id'>
  organizations: IFrontOrganizations
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
    delOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
    loadingOrganizations: boolean
  }
  setOrganization: (organization: IFrontOrganizationsItem) => void
}

export const errors = {
  quit: 'Unable to quit organization',
  accept: 'Unable to accept invitation',
  decline: 'Unable to decline invitation'
}

/**
 * On quit
 * @param organization Organization
 * @param user User
 * @parm swr SWR
 */
const onQuit = async (
  organization: Pick<IFrontOrganizationsItem, 'id' | 'users'>,
  user: Pick<IFrontUser, 'id'>,
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
): Promise<void> => {
  try {
    // API
    await OrganizationAPI.quit({ id: organization.id })

    // Local
    const newOrganization = Utils.deepCopy(organization)
    const userIndex = newOrganization.users.findIndex((u) => u.id === user.id)
    newOrganization.users.splice(userIndex, 1)

    swr.mutateOneOrganization(newOrganization)
  } catch (err) {
    ErrorNotification(errors.quit, err)
  }
}

/**
 * On accept
 * @param organization Organization
 * @param user User
 * @param swr SWR
 */
const onAccept = async (
  organization: Pick<
    IFrontOrganizationsItem,
    'id' | 'owners' | 'pendingowners' | 'users' | 'pendingusers'
  >,
  user: Pick<IFrontUser, 'id'>,
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
): Promise<void> => {
  try {
    // API
    await OrganizationAPI.accept(organization)

    // Local
    const newOrganization = Utils.deepCopy(organization)
    const ownerIndex = newOrganization.pendingowners.findIndex(
      (o) => o.id === user.id
    )
    const pendingowner = newOrganization.pendingowners[ownerIndex]

    if (ownerIndex !== -1) {
      newOrganization.pendingowners.splice(ownerIndex, 1)
      newOrganization.owners.push(pendingowner)
    } else {
      const userIndex = newOrganization.pendingusers.findIndex(
        (u) => u.id === user.id
      )
      const pendinguser = newOrganization.pendingusers[userIndex]
      newOrganization.pendingusers.splice(userIndex, 1)
      newOrganization.users.push(pendinguser)
    }

    swr.mutateOneOrganization(newOrganization)
  } catch (err) {
    ErrorNotification(errors.accept, err)
  }
}

/**
 * On decline
 * @param organization Organization
 * @param user User
 */
const onDecline = async (
  organization: Pick<
    IFrontOrganizationsItem,
    'id' | 'pendingowners' | 'pendingusers'
  >,
  user: Pick<IFrontUser, 'id'>,
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
): Promise<void> => {
  try {
    // API
    await OrganizationAPI.decline({ id: organization.id })

    // Local
    const newOrganization = Utils.deepCopy(organization)
    const ownerIndex = newOrganization.pendingowners?.findIndex(
      (o) => o.id === user.id
    )

    if (ownerIndex !== -1) newOrganization.pendingowners.splice(ownerIndex, 1)
    else {
      const userIndex = newOrganization.pendingusers?.findIndex(
        (u) => u.id === user.id
      )
      newOrganization.pendingusers.splice(userIndex, 1)
    }

    swr.mutateOneOrganization(newOrganization)
  } catch (err) {
    ErrorNotification(errors.decline, err)
  }
}

/**
 * List
 * @param props Props
 * @returns List
 */
const List = ({
  user,
  organizations,
  swr,
  setOrganization
}: IProps): JSX.Element => {
  // State
  const [scroll, setScroll] = useState<{ y: number } | null>(null)

  // Ref
  const refTableOrga = useRef<HTMLDivElement>(null)

  // Data
  const ownersRender = (owners: IFrontUsers) => (
    <Avatar.Group maxCount={5}>
      {owners?.map((o) => Utils.userToAvatar(o))}
    </Avatar.Group>
  )
  const usersRender = (users: IFrontUsers) => (
    <Avatar.Group maxCount={5}>
      {users?.map((u) => Utils.userToAvatar(u))}
    </Avatar.Group>
  )
  const groupsRender = (groups: IFrontGroups) => (
    <Avatar.Group maxCount={5}>
      {groups?.map((g) => Utils.groupToAvatar(g))}
    </Avatar.Group>
  )
  const actionsRender = (org: IFrontOrganizationsItem) => {
    if (org.owners.find((o) => o.id === user.id))
      return (
        <Space wrap>
          <Button
            icon={<ControlOutlined />}
            onClick={() => setOrganization(org)}
          >
            Manage
          </Button>
          <Delete
            organization={{
              id: org.id,
              name: org.name
            }}
            swr={{ delOneOrganization: swr.delOneOrganization }}
          />
        </Space>
      )
    else if (org.users.find((u) => u.id === user.id))
      return (
        <Space wrap>
          <Button
            danger
            icon={<LeftSquareOutlined />}
            onClick={() =>
              onQuit(
                { id: org.id, users: org.users },
                { id: user.id },
                { mutateOneOrganization: swr.mutateOneOrganization }
              )
            }
          >
            Quit
          </Button>
        </Space>
      )
    else if (
      org.pendingowners.find((o) => o.id === user.id) ||
      org.pendingusers.find((u) => u.id === user.id)
    )
      return (
        <Space wrap>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={async () =>
              onAccept(
                {
                  id: org.id,
                  owners: org.owners,
                  pendingowners: org.pendingowners,
                  users: org.users,
                  pendingusers: org.pendingusers
                },
                { id: user.id },
                { mutateOneOrganization: swr.mutateOneOrganization }
              )
            }
          >
            Accept invitation
          </Button>
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={() =>
              onDecline(
                {
                  id: org.id,
                  pendingowners: org.pendingowners,
                  pendingusers: org.pendingusers
                },
                { id: user.id },
                { mutateOneOrganization: swr.mutateOneOrganization }
              )
            }
          >
            Decline
          </Button>
        </Space>
      )
  }
  const columns: TableColumnsType<{
    name: string
  }> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: { name: string }, b: { name: string }) => {
        const na = a.name || ''
        const nb = b.name || ''
        return na.localeCompare(nb)
      }
    },
    {
      title: 'Administrators',
      dataIndex: 'owners',
      key: 'owners',
      render: ownersRender
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      render: usersRender
    },
    {
      title: 'Groups',
      dataIndex: 'groups',
      key: 'groups',

      render: groupsRender
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
    // Check if too many organizations to display
    const table = refTableOrga.current
    /* istanbul ignore next */
    if (!table) return
    if (table.clientHeight > window.innerHeight - table.offsetTop - 59) {
      setScroll({ y: window.innerHeight - table.offsetTop - 59 })
    } else {
      // Scroll not needed
      setScroll(null)
    }
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
  }, [organizations, onResize, refTableOrga.current?.offsetTop])

  /**
   * Render
   */
  return (
    <Table
      loading={swr.loadingOrganizations}
      pagination={false}
      size="small"
      columns={columns as ColumnGroupType<object>[]}
      dataSource={organizations?.map((organization) => ({
        key: organization.id,
        id: organization.id,
        name: organization.name,
        owners: organization.owners,
        pendingowners: organization.pendingowners,
        users: organization.users,
        pendingusers: organization.pendingusers,
        groups: organization.groups
      }))}
      ref={refTableOrga}
      scroll={{ y: scroll?.y }}
    />
  )
}

export default List
