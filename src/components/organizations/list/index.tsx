/** @module Components.Organizations.List */

import PropTypes from 'prop-types'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { Avatar, Button, Space, Table } from 'antd'
import { ControlOutlined } from '@ant-design/icons'

import {
  IGroupWithData,
  IOrganizationWithData,
  IUserWithData
} from '@/lib/index.d'

import Utils from '@/lib/utils'

import Delete from '../delete'

/**
 * Props
 */
export interface IProps {
  user: IUserWithData
  organizations: IOrganizationWithData[]
  swr: {
    delOneOrganization: (organization: IOrganizationWithData) => void
    loadingOrganizations: boolean
  }
  setOrganization: Dispatch<SetStateAction<IOrganizationWithData>>
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
  const [scroll, setScroll]: [
    { y: number },
    Dispatch<SetStateAction<{ y: number }>>
  ] = useState(null)

  // Ref
  const refTableOrga = useRef(null)

  // Data
  const ownersRender = (owners: IUserWithData[]) => (
    <Avatar.Group maxCount={5}>
      {owners?.map((o) => Utils.userToAvatar(o))}
    </Avatar.Group>
  )
  const usersRender = (users: IUserWithData[]) => (
    <Avatar.Group maxCount={5}>
      {users?.map((u) => Utils.userToAvatar(u))}
    </Avatar.Group>
  )
  const groupsRender = (groups: IGroupWithData[]) => (
    <Avatar.Group maxCount={5}>
      {groups?.map((g) => Utils.groupToAvatar(g))}
    </Avatar.Group>
  )
  const actionsRender = (org: IOrganizationWithData) => {
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
            organization={{
              id: org.id,
              name: org.name
            }}
            swr={{ delOneOrganization: swr.delOneOrganization }}
          />
        </Space>
      )
  }
  const columns = [
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

  // Update table scroll
  const onResize = useCallback(() => {
    // Check if too many organizations to display
    if (
      refTableOrga.current.clientHeight >
      window.innerHeight - refTableOrga.current.offsetTop - 59
    ) {
      setScroll({ y: window.innerHeight - refTableOrga.current.offsetTop - 59 })
    } else {
      // Scroll not needed
      setScroll(null)
    }
  }, [])

  // Handle window resize
  useEffect((): (() => void) => {
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // Set Table Scroll Limit
  useEffect(() => {
    onResize()
  }, [organizations, onResize])

  /**
   * Render
   */
  return (
    <Table
      loading={swr.loadingOrganizations}
      pagination={false}
      size="small"
      columns={columns}
      dataSource={organizations?.map((organization) => ({
        key: organization.id,
        id: organization.id,
        name: organization.name,
        owners: organization.owners,
        users: organization.users,
        groups: organization.groups
      }))}
      ref={refTableOrga}
      scroll={scroll}
    />
  )
}

List.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  organizations: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      owners: PropTypes.array.isRequired,
      users: PropTypes.array,
      groups: PropTypes.array
    })
  ).isRequired,
  swr: PropTypes.exact({
    delOneOrganization: PropTypes.func.isRequired,
    loadingOrganizations: PropTypes.bool.isRequired
  }).isRequired,
  setOrganization: PropTypes.func.isRequired
}

export default List
