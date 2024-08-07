/** @module Components.Organizations.List */

import {
  Dispatch,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
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

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

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
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
    delOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
    loadingOrganizations: boolean
  }
  setOrganization: (organization: IFrontOrganizationsItem) => void
}

export interface IManageProps {
  organization: IFrontOrganizationsItem
  swr: {
    delOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
  setOrganization: (organization: IFrontOrganizationsItem) => void
}

export interface IQuitProps {
  user: Pick<IFrontUser, 'id'>
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
  dispatch: Dispatch<INotificationAction>
}

export interface IAcceptProps {
  user: Pick<IFrontUser, 'id'>
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
  dispatch: Dispatch<INotificationAction>
}

export interface IDeclineProps {
  user: Pick<IFrontUser, 'id'>
  organization: IFrontOrganizationsItem
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
  dispatch: Dispatch<INotificationAction>
}

/**
 * Errors
 */
export const errors = {
  quit: 'Unable to quit organization',
  accept: 'Unable to accept invitation',
  decline: 'Unable to decline invitation'
}

/**
 * On quit
 * @param organization Organization
 * @param user User
 * @param swr SWR
 */
export const _onQuit = async (
  organization: Pick<IFrontOrganizationsItem, 'id' | 'users'>,
  user: Pick<IFrontUser, 'id'>,
  swr: {
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
): Promise<void> => {
  // API
  await OrganizationAPI.quit({ id: organization.id })

  // Local
  const newOrganization = Utils.deepCopy(organization)
  const userIndex = newOrganization.users.findIndex((u) => u.id === user.id)
  newOrganization.users.splice(userIndex, 1)

  await swr.mutateOneOrganization(newOrganization)
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
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
): Promise<void> => {
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
    newOrganization.owners.push({
      ...pendingowner,
      workspaces: [],
      projects: [],
      usermodels: []
    })
  } else {
    const userIndex = newOrganization.pendingusers.findIndex(
      (u) => u.id === user.id
    )
    const pendinguser = newOrganization.pendingusers[userIndex]
    newOrganization.pendingusers.splice(userIndex, 1)
    newOrganization.users.push({
      ...pendinguser,
      workspaces: [],
      projects: [],
      usermodels: []
    })
  }

  await swr.mutateOneOrganization(newOrganization)
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
    mutateOneOrganization: (
      organization: IFrontMutateOrganizationsItem
    ) => Promise<void>
  }
): Promise<void> => {
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

  await swr.mutateOneOrganization(newOrganization)
}

/**
 * ManageButton
 * @param props props
 * @returns ManageButton
 */
const ManageButton: React.FunctionComponent<IManageProps> = ({
  organization,
  swr,
  setOrganization
}) => {
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
const QuitButton: React.FunctionComponent<IQuitProps> = ({
  user,
  organization,
  swr,
  dispatch
}) => {
  /**
   * On click
   */
  const onClick = useCallback((): void => {
    asyncFunctionExec(async () => {
      try {
        await _onQuit(
          { id: organization.id, users: organization.users },
          { id: user.id },
          { mutateOneOrganization: swr.mutateOneOrganization }
        )
      } catch (err: any) {
        dispatch(addError({ title: errors.quit, err }))
      }
    })
  }, [user, organization, swr, dispatch])

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
const AcceptButton: React.FunctionComponent<IAcceptProps> = ({
  user,
  organization,
  swr,
  dispatch
}) => {
  /**
   * On click
   */
  const onClick = useCallback((): void => {
    asyncFunctionExec(async () => {
      try {
        await _onAccept(
          {
            id: organization.id,
            owners: organization.owners,
            pendingowners: organization.pendingowners,
            users: organization.users,
            pendingusers: organization.pendingusers
          },
          { id: user.id },
          { mutateOneOrganization: swr.mutateOneOrganization }
        )
      } catch (err: any) {
        dispatch(addError({ title: errors.accept, err }))
      }
    })
  }, [user, organization, swr, dispatch])

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
const DeclineButton: React.FunctionComponent<IDeclineProps> = ({
  user,
  organization,
  swr,
  dispatch
}) => {
  const onClick = useCallback((): void => {
    asyncFunctionExec(async () => {
      try {
        await _onDecline(
          {
            id: organization.id,
            pendingowners: organization.pendingowners,
            pendingusers: organization.pendingusers
          },
          { id: user.id },
          { mutateOneOrganization: swr.mutateOneOrganization }
        )
      } catch (err: any) {
        dispatch(
          addError({
            title: errors.decline,
            err
          })
        )
      }
    })
  }, [user, organization, swr, dispatch])

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
const List: React.FunctionComponent<IProps> = ({
  user,
  organizations,
  swr,
  setOrganization
}) => {
  // State
  const [scroll, setScroll] = useState<{ y: number } | null>(null)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Ref
  const refTableOrga = useRef<any>(null)

  /**
   * Owners render
   * @param owners Owners
   * @returns Render
   */
  const ownersRender = useCallback(
    (owners: IFrontUsers): ReactNode => (
      <Avatar.Group max={{ count: 5 }}>
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
    (users: IFrontUsers): ReactNode => (
      <Avatar.Group max={{ count: 5 }}>
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
    (groups: IFrontGroups): ReactNode => (
      <Avatar.Group max={{ count: 5 }}>
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
    (org: IFrontOrganizationsItem): ReactNode => {
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
              dispatch={dispatch}
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
              dispatch={dispatch}
            />
            <DeclineButton
              user={user}
              organization={org}
              swr={{ mutateOneOrganization: swr.mutateOneOrganization }}
              dispatch={dispatch}
            />
          </Space>
        )
      return null
    },
    [user, swr, setOrganization, dispatch]
  )

  // Columns
  const columns: TableColumnsType<{
    name: string
  }> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: (a: { name: string }, b: { name: string }) => {
          const na = a.name ?? ''
          const nb = b.name ?? ''
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
