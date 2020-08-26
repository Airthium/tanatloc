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
import Workspace from '../../components/workspace'
import Account from '../../components/account'
import Help from '../../components/help'

import { useUser } from '../../../src/api/user'
import { useWorkspaces } from '../../../src/api/workspace'
import logout from '../../../src/api/logout'

/**
 * Menu items
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
  const [currentView, setCurrentView] = useState(menuItems.workspaces.key)
  const [currentWorkspace, setCurrentWorkspace] = useState()

  // Data
  const [user, { mutateUser, loadingUser }] = useUser()
  const [workspaces] = useWorkspaces()

  // Router
  const router = useRouter()

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  // Default workspace
  useEffect(() => {
    if (user && workspaces && !currentWorkspace) {
      const firstWorkspace = workspaces[0]

      if (!firstWorkspace) return

      let view
      if (firstWorkspace.owners && firstWorkspace.owners.includes(user.id))
        view = menuItems.workspaces.key
      else if (firstWorkspace.users && firstWorkspace.users.includes(user.id))
        view = menuItems.shared.key

      setCurrentView(view)
      setCurrentWorkspace(firstWorkspace)
    }
  }, [workspaces])

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
      const workspace = workspaces[key]
      setCurrentWorkspace(workspace)
    } else {
      if (key === menuItems.logout.key) handleLogout()
      else setCurrentView(key)
    }
  }

  /**
   * Logout
   */
  const handleLogout = async () => {
    await logout()
    mutateUser({ user: null })
  }

  // My / Shared workspaces
  let myWorkspaces = []
  let sharedWorkspaces = []
  if (user && workspaces) {
    workspaces.forEach((workspace, index) => {
      if (workspace.owners && workspace.owners.includes(user.id))
        myWorkspaces.push(<Menu.Item key={index}>{workspace.name}</Menu.Item>)
      else if (workspace.users && workspace.users.includes(user.id))
        sharedWorkspaces.push(
          <Menu.Item key={index}>{workspace.name}</Menu.Item>
        )
    })
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
              onSelect={onSelect}
              defaultOpenKeys={[menuItems.workspaces.key, menuItems.shared.key]}
              mode="inline"
            >
              <Menu.SubMenu
                key={menuItems.workspaces.key}
                icon={<AppstoreTwoTone />}
                title={menuItems.workspaces.label}
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

          <Layout.Content className="no-scroll">
            {(currentView === menuItems.workspaces.key ||
              currentView === menuItems.shared.key) && (
              <Workspace workspace={currentWorkspace} />
            )}
            {currentView === menuItems.account.key && <Account />}
            {currentView === menuItems.help.key && <Help />}
          </Layout.Content>
        </Layout>
      )}
    </>
  )
}

export default Dashboard
