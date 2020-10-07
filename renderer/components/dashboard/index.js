/** @module renderer/components/dashboard */

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreTwoTone,
  LogoutOutlined,
  QuestionCircleTwoTone,
  SettingTwoTone,
  ShareAltOutlined
} from '@ant-design/icons'

import Loading from '../../components/loading'
import Welcome from './welcome'
import Workspace from '../../components/workspace'
import Account from '../../components/account'
import Help from '../../components/help'

import { useUser } from '../../../src/api/user'
import { useWorkspaces } from '../../../src/api/workspace'
import logout from '../../../src/api/logout'

/**
 * Dashboard menu items
 */
const menuItems = {
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
  const [currentView, setCurrentView] = useState()
  const [currentWorkspace, setCurrentWorkspace] = useState()

  // Data
  const [user, { mutateUser, loadingUser }] = useUser()
  const [workspaces] = useWorkspaces()

  // Router
  const router = useRouter()
  const { page, workspaceId } = router.query

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  // Update workspace
  useEffect(() => {
    if (currentWorkspace) {
      const workspaceIndex = workspaces?.findIndex(
        (w) => w.id === currentWorkspace.id
      )
      if (workspaceIndex !== -1) {
        const workspace = workspaces[workspaceIndex]
        if (JSON.stringify(workspace) !== JSON.stringify(currentWorkspace))
          setCurrentWorkspace(workspace)
      } else {
        setCurrentWorkspace()
      }
    }
  }, [workspaces, currentWorkspace])

  /**
   * Menu selection
   * @param {Object} data {item, key}
   */
  const onSelect = ({ item, key }) => {
    const subMenuKey = item.props.subMenuKey.replace('-menu-', '')

    // In a submenu
    if (
      subMenuKey === menuItems.workspaces.key ||
      subMenuKey === menuItems.shared.key
    ) {
      setCurrentView(subMenuKey)
      router.replace({
        pathname: '/dashboard',
        query: { page: subMenuKey }
      })

      const workspace = workspaces[key]
      setCurrentWorkspace(workspace)
    } else {
      if (key === menuItems.logout.key) handleLogout()
      else {
        setCurrentView(key)
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
  const handleLogout = async () => {
    await logout()
    mutateUser({ user: null })

    router.push('/')
  }

  // My / Shared workspaces
  let myWorkspaces = []
  let sharedWorkspaces = []
  if (user) {
    workspaces?.forEach((workspace, index) => {
      if (workspace.owners && workspace.owners.includes(user.id))
        myWorkspaces.push(<Menu.Item key={index}>{workspace.name}</Menu.Item>)
      else if (workspace.users && workspace.users.includes(user.id))
        sharedWorkspaces.push(
          <Menu.Item key={index}>{workspace.name}</Menu.Item>
        )
    })
  }

  const onWorkspaces = () => {
    if (!myWorkspaces?.length) {
      setCurrentView()
    }
  }

  // Page effect
  useEffect(() => {
    if (workspaceId) {
      const workspace = workspaces?.find((w) => w.id === workspaceId)
      if (workspace) {
        if (workspace.owners && workspace.owners.includes(user.id))
          setCurrentView(menuItems.workspaces.key)
        else if (workspace.users && workspace.users.includes(user.id))
          setCurrentView(menuItems.shared.key)
        setCurrentWorkspace(workspace)
      }
    } else if (page) {
      setCurrentView(page)
    }
  }, [page, workspaceId, workspaces])

  let displayed
  switch (currentView) {
    case menuItems.workspaces.key:
    case menuItems.shared.key:
      displayed = <Workspace workspace={currentWorkspace} />
      break
    case menuItems.account.key:
      displayed = <Account />
      break
    case menuItems.help.key:
      displayed = <Help />
      break
    default:
      displayed = <Welcome />
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
          <Layout.Sider theme="light" className="Dashboard-sider">
            <div className="logo">
              <img src="/images/logo.svg" />
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
                icon={<AppstoreTwoTone />}
                title={menuItems.workspaces.label}
                onTitleClick={onWorkspaces}
              >
                {myWorkspaces}
              </Menu.SubMenu>
              <Menu.SubMenu
                key={menuItems.shared.key}
                icon={<ShareAltOutlined />}
                title={menuItems.shared.label}
              >
                {sharedWorkspaces}
              </Menu.SubMenu>
              <Menu.Item key={menuItems.account.key} icon={<SettingTwoTone />}>
                {menuItems.account.label}
              </Menu.Item>
              <Menu.Item
                key={menuItems.help.key}
                icon={<QuestionCircleTwoTone />}
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
            </Menu>
          </Layout.Sider>

          <Layout.Content className="no-scroll">{displayed}</Layout.Content>
        </Layout>
      )}
    </>
  )
}

export default Dashboard
