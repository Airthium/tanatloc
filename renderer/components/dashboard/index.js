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
import WorkspacePage from '../../components/workspace'

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

// TODO
const Account = 'account'

// TODO
const Help = 'help'

/**
 * Dashboard
 */
const Dashboard = () => {
  // State
  const [currentView, setCurrentView] = useState(menuItems.workspaces.key)
  const [currentWorkspace, setCurrentWorkspace] = useState()

  // Data
  const [user, { mutateUser, loadingUser }] = useUser()
  const [workspaces, { loadingWorkspaces }] = useWorkspaces()

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

  /**
   * Render
   */
  return (
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
            {user &&
              workspaces &&
              workspaces.map((workspace, index) => {
                if (workspace.owners && workspace.owners.includes(user.id))
                  return <Menu.Item key={index}>{workspace.name}</Menu.Item>
              })}
          </Menu.SubMenu>
          <Menu.SubMenu
            key={menuItems.shared.key}
            icon={<ShareAltOutlined />}
            title={menuItems.shared.label}
          >
            {user &&
              workspaces &&
              workspaces.map((workspace, index) => {
                if (workspace.users && workspace.users.includes(user.id))
                  return <Menu.Item key={index}>{workspace.name}</Menu.Item>
              })}
          </Menu.SubMenu>
          <Menu.Item key={menuItems.account.key} icon={<SettingTwoTone />}>
            {menuItems.account.label}
          </Menu.Item>
          <Menu.Item key={menuItems.help.key} icon={<QuestionCircleTwoTone />}>
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
          <WorkspacePage workspace={currentWorkspace} />
        )}
        {currentView === menuItems.account.key && <Account />}
        {currentView === menuItems.help.key && <Help />}
      </Layout.Content>
    </Layout>
  )
}

export default Dashboard
