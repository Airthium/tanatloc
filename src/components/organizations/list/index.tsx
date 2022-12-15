/** @module Components.Organizations.List */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Avatar, Button, Space, Table, TableColumnsType } from 'antd'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ControlOutlined,
  LeftSquareOutlined
} from '@ant-design/icons'
import { ColumnGroupType } from 'antd/lib/table'

import {
  IFrontUser,
  IFrontUsers,
  IFrontGroups,
  IFrontOrganizations,
  IFrontOrganizationsItem,
  IFrontMutateOrganizationsItem
} from '@/api/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

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

export interface IManageProps {
  organization: IFrontOrganizationsItem
  swr: {
    delOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
  setOrganization: (organization: IFrontOrganizationsItem) => void
}

export interface IQuitProps {
  user: Pick<IFrontUser, 'id'>
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
}

export interface IAcceptProps {
  user: Pick<IFrontUser, 'id'>
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
}

export interface IDeclineProps {
  user: Pick<IFrontUser, 'id'>
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (organization: IFrontMutateOrganizationsItem) => void
  }
}

/**
 * On quit
 * @param organization Organization
 * @param user User
 * @parm swr SWR
 */
export const _onQuit = async (
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
export const _onAccept = async (
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
export const _onDecline = async (
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
 * ManageButton
 * @param props props
 * @returns ManageButton
 */
const ManageButton = ({
  organization,
  swr,
  setOrganization
}: IManageProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(
    () => setOrganization(organization),
    [organization, setOrganization]
  )

  /**
   * Render
   */
  return (
    <>
      <Button icon={<ControlOutlined />} onClick={onClick}>
        Manage
      </Button>
      <Delete
        organization={{
          id: organization.id,
          name: organization.name
        }}
        swr={{ delOneOrganization: swr.delOneOrganization }}
      />
    </>
  )
}

/**
 * QuitButton
 * @param props Props
 * @returns QuitButton
 */
const QuitButton = ({ user, organization, swr }: IQuitProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(
    () =>
      _onQuit(
        { id: organization.id, users: organization.users },
        { id: user.id },
        { mutateOneOrganization: swr.mutateOneOrganization }
      ),
    [user, organization, swr]
  )

  /**
   * Render
   */
  return (
    <Button danger icon={<LeftSquareOutlined />} onClick={onClick}>
      Quit
    </Button>
  )
}

/**
 * AcceptButton
 * @param props Props
 * @returns AcceptButton
 */
const AcceptButton = ({
  user,
  organization,
  swr
}: IAcceptProps): JSX.Element => {
  /**
   * On click
   */
  const onClick = useCallback(
    async () =>
      _onAccept(
        {
          id: organization.id,
          owners: organization.owners,
          pendingowners: organization.pendingowners,
          users: organization.users,
          pendingusers: organization.pendingusers
        },
        { id: user.id },
        { mutateOneOrganization: swr.mutateOneOrganization }
      ),
    [user, organization, swr]
  )

  /**
   * Render
   */
  return (
    <Button type="primary" icon={<CheckCircleOutlined />} onClick={onClick}>
      Accept invitation
    </Button>
  )
}

/**
 * DeclineButton
 * @param props Props
 * @returns DeclineButton
 */
const DeclineButton = ({
  user,
  organization,
  swr
}: IDeclineProps): JSX.Element => {
  const onClick = useCallback(
    () =>
      _onDecline(
        {
          id: organization.id,
          pendingowners: organization.pendingowners,
          pendingusers: organization.pendingusers
        },
        { id: user.id },
        { mutateOneOrganization: swr.mutateOneOrganization }
      ),
    [user, organization, swr]
  )

  /**
   * Render
   */
  return (
    <Button danger icon={<CloseCircleOutlined />} onClick={onClick}>
      Decline
    </Button>
  )
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

  /**
   * Owners render
   * @param owners Owners
   * @returns Render
   */
  const ownersRender = useCallback(
    (owners: IFrontUsers) => (
      <Avatar.Group maxCount={5}>
        {owners?.map((o) => Utils.userToAvatar(o))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Users render
   * @param users Users
   * @returns Render
   */
  const usersRender = useCallback(
    (users: IFrontUsers) => (
      <Avatar.Group maxCount={5}>
        {users?.map((u) => Utils.userToAvatar(u))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Groups render
   * @param groupd Groups
   * @returns Render
   */
  const groupsRender = useCallback(
    (groups: IFrontGroups) => (
      <Avatar.Group maxCount={5}>
        {groups?.map((g) => Utils.groupToAvatar(g))}
      </Avatar.Group>
    ),
    []
  )

  /**
   * Actions render
   * @param org Organization
   * @returns Render
   */
  const actionsRender = useCallback(
    (org: IFrontOrganizationsItem) => {
      if (org.owners.find((o) => o.id === user.id))
        return (
          <Space wrap>
            <ManageButton
              organization={org}
              swr={{ delOneOrganization: swr.delOneOrganization }}
              setOrganization={setOrganization}
            />
          </Space>
        )
      else if (org.users.find((u) => u.id === user.id))
        return (
          <Space wrap>
            <QuitButton
              user={user}
              organization={org}
              swr={{ mutateOneOrganization: swr.mutateOneOrganization }}
            />
          </Space>
        )
      else if (
        org.pendingowners.find((o) => o.id === user.id) ||
        org.pendingusers.find((u) => u.id === user.id)
      )
        return (
          <Space wrap>
            <AcceptButton
              user={user}
              organization={org}
              swr={{ mutateOneOrganization: swr.mutateOneOrganization }}
            />
            <DeclineButton
              user={user}
              organization={org}
              swr={{ mutateOneOrganization: swr.mutateOneOrganization }}
            />
          </Space>
        )
    },
    [user, swr, setOrganization]
  )

  const columns: TableColumnsType<{
    name: string
  }> = useMemo(
    () => [
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
    ],
    [ownersRender, usersRender, groupsRender, actionsRender]
  )

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
