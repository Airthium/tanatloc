/** @module components/dashboard */

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import Icon, {
  AppstoreFilled,
  ControlOutlined,
  ShareAltOutlined,
  SettingFilled,
  QuestionCircleFilled,
  LogoutOutlined
} from '@ant-design/icons'
import Usergroup from '/public/icons/usergroup'

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
  const [currentView, setCurrentView] = useState()
  const [currentWorkspace, setCurrentWorkspace] = useState()

  // Data
  const [user, { mutateUser, loadingUser }] = UserAPI.useUser()
  const [
    organizations,
    {
      reloadOrganizations,
      addOneOrganization,
      delOneOrganization,
      mutateOneOrganization,
      loadingOrganizations
    }
  ] = OrganizationAPI.useOrganizations()
  const [
    workspaces,
    { addOneWorkspace, delOneWorkspace, mutateOneWorkspace }
  ] = WorkspaceAPI.useWorkspaces()

  // Router
  const router = useRouter()
  const { page, workspaceId } = router.query

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

  // Update workspace
  useEffect(() => {
    if (currentWorkspace) {
      const workspace = workspaces?.find((w) => w.id === currentWorkspace.id)
      if (JSON.stringify(workspace) !== JSON.stringify(currentWorkspace)) {
        updateCurrentView(null, workspace)
      }
    }
  }, [currentWorkspace, JSON.stringify(workspaces)])

  // Page effect
  useEffect(() => {
    if (workspaceId) {
      if (currentWorkspace?.id === workspaceId) return

      // Search in myWorkspaces
      const myWorkspace = myWorkspaces?.find(
        (workspace) => workspace.id === workspaceId
      )
      if (myWorkspace) {
        updateCurrentView(menuItems.workspaces.key, myWorkspace)
        return
      }

      // Search in sharedWorkspaces
      const sharedWorkspace = sharedWorkspaces?.find(
        (workspace) => workspace.id === workspaceId
      )
      if (sharedWorkspace) {
        updateCurrentView(menuItems.shared.key, sharedWorkspace)
      }
    } else if (page) {
      updateCurrentView(page)
    } else {
      updateCurrentView(menuItems.welcome.key)
    }
  }, [
    workspaceId,
    page,
    JSON.stringify(myWorkspaces),
    JSON.stringify(sharedWorkspaces)
  ])

  /**
   * Menu selection
   * @param {Object} data {item, key}
   */
  const onSelect = ({ item, key }) => {
    const subMenuKey = item.props.subMenuKey.replace('-menu-', '')

    // In a submenu
    if (subMenuKey === menuItems.workspaces.key) {
      const workspace = myWorkspaces?.find((w) => w.id === key)
      updateCurrentView(subMenuKey, workspace)
      router.replace({
        pathname: '/dashboard',
        query: { page: subMenuKey, workspaceId: key }
      })
    } else if (subMenuKey === menuItems.shared.key) {
      const workspace = sharedWorkspaces?.find((w) => w.id === key)
      updateCurrentView(subMenuKey, workspace)
      router.replace({
        pathname: '/dashboard',
        query: { page: subMenuKey, workspaceId: key }
      })
    } else {
      if (key === menuItems.logout.key) onLogout()
      else {
        updateCurrentView(key)
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
      updateCurrentView(menuItems.welcome.key)
    }
  }

  /**
   * On shared workspaces
   */
  const onSharedWorkspaces = () => {
    if (!sharedWorkspaces?.length) {
      updateCurrentView(menuItems.empty.key)
    }
  }

  /**
   * Update current view
   * @param {string} key Key
   * @param {Object} workspace Workspace
   */
  const updateCurrentView = (key, workspace) => {
    setCurrentWorkspace(workspace)
    if (!key) return
    switch (key) {
      case menuItems.workspaces.key:
      case menuItems.shared.key:
        workspace
          ? setCurrentView(
              <Workspace
                user={{ id: user?.id }}
                workspace={workspace}
                organizations={organizations}
                swr={{ delOneWorkspace, mutateOneWorkspace }}
              />
            )
          : setCurrentView(<Welcome swr={{ addOneWorkspace }} />)
        break
      case menuItems.account.key:
        setCurrentView(<Account user={user || {}} swr={{ mutateUser }} />)
        break
      case menuItems.organizations.key:
        setCurrentView(
          <Organizations
            user={user || {}}
            organizations={organizations || []}
            swr={{
              reloadOrganizations,
              addOneOrganization,
              delOneOrganization,
              mutateOneOrganization,
              loadingOrganizations
            }}
          />
        )
        break
      case menuItems.administration.key:
        setCurrentView(<Administration />)
        break
      case menuItems.help.key:
        setCurrentView(<Help />)
        break
      case menuItems.empty.key:
        setCurrentView(<Empty />)
        break
      case menuItems.welcome.key:
      default:
        setCurrentView(<Welcome swr={{ addOneWorkspace }} />)
    }
  }

  /**
   * Render
   */
  return (
    <>
      {loadingUser || !user ? (
        <Loading />
      ) : (
        <Layout>
          <Layout.Sider theme="light" width="250" className="Dashboard-sider">
            <div className="logo">
              <img src="/images/logo_enora.svg" />
            </div>

            <Menu
              className="Dashboard-menu"
              theme="light"
              onClick={onSelect}
              defaultOpenKeys={[menuItems.workspaces.key, menuItems.shared.key]}
              mode="inline"
            >
              <Menu.SubMenu
                key={menuItems.workspaces.key}
                icon={<AppstoreFilled />}
                title={menuItems.workspaces.label}
                onTitleClick={onMyWorkspaces}
              >
                {myWorkspaces?.map((workspace) => (
                  <Menu.Item key={workspace.id}>{workspace.name}</Menu.Item>
                ))}
                <li id="Add-workspace-button">
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
              <Menu.Item key={menuItems.account.key} icon={<SettingFilled />}>
                {menuItems.account.label}
              </Menu.Item>
              <Menu.Item
                key={menuItems.organizations.key}
                icon={<Icon component={Usergroup} />}
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
                icon={<QuestionCircleFilled />}
              >
                {menuItems.help.label}
              </Menu.Item>
              <Menu.Divider />
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

          <Layout.Content className="no-scroll">{currentView}</Layout.Content>
        </Layout>
      )}
    </>
  )
}

export default Dashboard
