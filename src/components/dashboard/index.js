/** @module components/dashboard */

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import Icon, {
  AppstoreOutlined,
  ControlOutlined,
  ShareAltOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  TeamOutlined
} from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

import Loading from '@/components/loading'
import Workspace from '@/components/workspace'
import Add from '@/components/workspace/add'
import Account from '@/components/account'
import Organizations from '@/components/organizations'
import Administration from '@/components/administration'
import Help from '@/components/help'

import Empty from './empty'
import Welcome from './welcome'

import UserAPI from '@/api/user'
import OrganizationAPI from '@/api/organization'
import WorkspaceAPI from '@/api/workspace'
import logout from '@/api/logout'

/**
 * Errors
 */
const errors = {
  user: 'User error',
  organizations: 'Organizations error',
  workspaces: 'Workspaces error',
  logoutError: 'Unable to logout'
}

/**
 * Dashboard menu items
 */
const menuItems = {
  welcome: {
    key: 'welcome'
  },
  empty: {
    key: 'empty'
  },
  workspaces: {
    label: 'My Workspaces',
    key: 'my_workspaces'
  },
  shared: {
    label: 'Shared With Me',
    key: 'shared'
  },
  account: {
    label: 'Account Settings',
    key: 'account'
  },
  organizations: {
    label: 'Organizations',
    key: 'organizations'
  },
  administration: {
    label: 'Administration',
    key: 'administration'
  },
  help: {
    label: 'I Need Help',
    key: 'help'
  },
  logout: {
    label: 'Logout',
    key: 'logout'
  }
}

/**
 * Dashboard
 */
const Dashboard = () => {
  // State
  const [myWorkspaces, setMyWorkspaces] = useState([])
  const [sharedWorkspaces, setSharedWorkspaces] = useState([])
  const [currentKey, setCurrentKey] = useState()
  const [currentWorkspace, setCurrentWorkspace] = useState()

  // Data
  const [user, { mutateUser, errorUser, loadingUser }] = UserAPI.useUser()
  const [
    organizations,
    {
      reloadOrganizations,
      addOneOrganization,
      delOneOrganization,
      mutateOneOrganization,
      errorOrganizations,
      loadingOrganizations
    }
  ] = OrganizationAPI.useOrganizations()
  const [
    workspaces,
    {
      addOneWorkspace,
      delOneWorkspace,
      mutateOneWorkspace,
      errorWorkspaces,
      loadingWorkspaces
    }
  ] = WorkspaceAPI.useWorkspaces()

  // Router
  const router = useRouter()

  // Page effect, only on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page')
    const workspaceId = params.get('workspaceId')

    setCurrentWorkspace(workspaceId)

    if (
      (page === menuItems.workspaces.key || page === menuItems.shared.key) &&
      !workspaceId
    )
      setCurrentKey(menuItems.welcome.key)
    else setCurrentKey(page)
  }, [])

  // Error
  useEffect(() => {
    if (errorUser) Error(errors.user, errorUser)
    if (errorOrganizations) Error(errors.organizations, errorOrganizations)
    if (errorWorkspaces) Error(errors.workspaces, errorWorkspaces)
  }, [errorUser, errorOrganizations, errorWorkspaces])

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  // My / shared workspaces
  useEffect(() => {
    if (!user) return

    const my = workspaces
      .map((workspace) => {
        if (workspace.owners?.find((o) => o.id === user.id)) return workspace
      })
      .filter((w) => w)

    const shared = workspaces
      .map((workspace) => {
        if (
          workspace.users?.find((u) => u.id === user.id) ||
          workspace.groups?.find((g) => user.groups?.includes(g.id))
        )
          return workspace
      })
      .filter((w) => w)

    if (JSON.stringify(my) !== JSON.stringify(myWorkspaces)) setMyWorkspaces(my)
    if (JSON.stringify(shared) !== JSON.stringify(sharedWorkspaces))
      setSharedWorkspaces(shared)
  }, [user, JSON.stringify(workspaces)])

  /**
   * Menu selection
   * @param {Object} data { keyPath }
   */
  const onSelect = ({ keyPath }) => {
    let key = keyPath.pop()
    let subKey = keyPath.pop()

    // In a submenu
    if (key === menuItems.workspaces.key || key === menuItems.shared.key) {
      setCurrentWorkspace(subKey)
      setCurrentKey(key)
      router.replace({
        pathname: '/dashboard',
        query: { page: key, workspaceId: subKey }
      })
    } else {
      if (key === menuItems.logout.key) onLogout()
      else {
        setCurrentKey(key)
        router.replace({
          pathname: '/dashboard',
          query: { page: key }
        })
      }
    }
  }

  /**
   * Logout
   */
  const onLogout = async () => {
    try {
      await logout()
      mutateUser({ user: null })

      router.push('/')
    } catch (err) {
      Error(errors.logoutError, err)
    }
  }

  /**
   * On my workspaces
   */
  const onMyWorkspaces = () => {
    if (!myWorkspaces?.length) {
      setCurrentKey(menuItems.welcome.key)
    }
  }

  /**
   * On shared workspaces
   */
  const onSharedWorkspaces = () => {
    if (!sharedWorkspaces?.length) {
      setCurrentKey(menuItems.empty.key)
    }
  }

  let workspaceToRender
  if (currentWorkspace && currentKey === menuItems.workspaces.key) {
    workspaceToRender = myWorkspaces.find((w) => w.id === currentWorkspace)
  } else if (currentWorkspace && currentKey === menuItems.shared.key) {
    workspaceToRender = sharedWorkspaces.find((w) => w.id === currentWorkspace)
  }

  /**
   * Render
   */
  return (
    <>
      {loadingUser || loadingOrganizations || loadingWorkspaces || !user ? (
        <Loading />
      ) : (
        <Layout>
          <Layout.Sider theme="light" width="256" className="dashboard-sider">
            <div className="logo">
              <img src="/images/logo.svg" />
            </div>

            <Menu
              className="dashboard-menu"
              theme="light"
              onClick={onSelect}
              defaultOpenKeys={[menuItems.workspaces.key, menuItems.shared.key]}
              mode="inline"
            >
              <Menu.SubMenu
                key={menuItems.workspaces.key}
                icon={<AppstoreOutlined />}
                title={menuItems.workspaces.label}
                onTitleClick={onMyWorkspaces}
              >
                {myWorkspaces?.map((workspace) => (
                  <Menu.Item key={workspace.id}>{workspace.name}</Menu.Item>
                ))}
                <li id="add-workspace-button">
                  <Add key="add" swr={{ addOneWorkspace }} />
                </li>
              </Menu.SubMenu>
              <Menu.SubMenu
                key={menuItems.shared.key}
                icon={<ShareAltOutlined />}
                title={menuItems.shared.label}
                onTitleClick={onSharedWorkspaces}
              >
                {sharedWorkspaces?.map((workspace) => (
                  <Menu.Item key={workspace.id}>{workspace.name}</Menu.Item>
                ))}
              </Menu.SubMenu>
              <Menu.Item key={menuItems.account.key} icon={<SettingOutlined />}>
                {menuItems.account.label}
              </Menu.Item>
              <Menu.Item
                key={menuItems.organizations.key}
                icon={<TeamOutlined />}
              >
                {menuItems.organizations.label}
              </Menu.Item>
              {user.superuser && (
                <Menu.Item
                  key={menuItems.administration.key}
                  icon={<ControlOutlined />}
                >
                  {menuItems.administration.label}
                </Menu.Item>
              )}
              <Menu.Item
                key={menuItems.help.key}
                icon={<QuestionCircleOutlined />}
              >
                {menuItems.help.label}
              </Menu.Item>
              <Menu.Divider className="dashboard-menu-divider" />
              <Menu.Item
                key={menuItems.logout.key}
                danger={true}
                icon={<LogoutOutlined />}
              >
                {menuItems.logout.label}
              </Menu.Item>
              <p className="version">
                version: git-{process.env.SOURCE_BRANCH}-
                {process.env.SOURCE_COMMIT}
              </p>
            </Menu>
          </Layout.Sider>

          <Layout.Content className="no-scroll">
            {(currentKey === menuItems.workspaces.key ||
              currentKey === menuItems.shared.key) && (
              <Workspace
                loading={!workspaceToRender}
                user={{ id: user?.id }}
                workspace={workspaceToRender}
                organizations={organizations}
                swr={{ delOneWorkspace, mutateOneWorkspace }}
              />
            )}
            {currentKey === menuItems.account.key && (
              <Account
                user={{
                  email: user?.email,
                  firstname: user?.firstname,
                  lastname: user?.lastname,
                  avatar: user?.avatar,
                  authorizedplugins: user?.authorizedplugins
                }}
                swr={{ mutateUser }}
              />
            )}
            {currentKey === menuItems.organizations.key && (
              <Organizations
                user={{ id: user?.id }}
                organizations={organizations || []}
                swr={{
                  reloadOrganizations,
                  addOneOrganization,
                  delOneOrganization,
                  mutateOneOrganization,
                  loadingOrganizations
                }}
              />
            )}
            {currentKey === menuItems.administration.key && <Administration />}
            {currentKey === menuItems.help.key && <Help />}
            {currentKey === menuItems.empty.key && <Empty />}
            {currentKey === menuItems.welcome.key && (
              <Welcome swr={{ addOneWorkspace }} />
            )}
          </Layout.Content>
        </Layout>
      )}
    </>
  )
}

export default Dashboard
