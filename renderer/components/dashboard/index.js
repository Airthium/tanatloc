import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Avatar, Layout, Menu } from 'antd'
import {
  UserOutlined,
  AppstoreTwoTone,
  LogoutOutlined,
  QuestionCircleTwoTone,
  SettingTwoTone,
  ShareAltOutlined
} from '@ant-design/icons'
import WorkspacePage from '../../components/workspace'

import useUser from '../../../src/api/user/useUser'
import useWorkspace from '../../../src/api/workspace/useWorkspace'
import logout from '../../../src/api/logout'

const menuItems = {
  workspaces: {
    label: 'My Workspaces',
    key: '1'
  },
  shared: {
    label: 'Shared With Me',
    key: '2'
  },
  account: {
    label: 'Account Settings',
    key: '3'
  },
  help: {
    label: 'I Need Help',
    key: '4'
  },
  logout: {
    label: 'Logout',
    key: '5'
  }
}

// TODO
const Account = 'account'

// TODO
const Help = 'help'

const DashboardPage = () => {
  // State
  const [currentView, setCurrentView] = useState(menuItems.workspaces.key)
  const [currentWorkspace, setCurrentWorkspace] = useState()

  const [user, { mutate, loading }] = useUser()
  const [workspaces] = useWorkspace()

  // Router
  const router = useRouter()

  // Menu
  const onSelect = ({ item, key }) => {
    const subMenuKey = item.props.subMenuKey.replace('-menu-', '')

    // In a submenu
    if (parseInt(subMenuKey)) {
      setCurrentView(subMenuKey)
      if (subMenuKey === '1') {
        // My workspaces
        const workspace = myWorkspaces[key]
        setCurrentWorkspace(workspace)
      } else if (subMenuKey === '2') {
        // Shared with me workspaces
        const workspace = sharedWorkspaces[key]
        setCurrentWorkspace(workspace)
      }
    } else {
      if (key === menuItems.logout.key) handleLogout()
      else setCurrentView(key)
    }
  }

  // Logout
  const handleLogout = async () => {
    await logout()
    mutate({ user: null })
  }

  // Effect
  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading])

  // Workspaces
  let myWorkspaces = []
  let sharedWorkspaces = []
  if (workspaces) {
    myWorkspaces = workspaces.filter(
      (workspace) => workspace.owners && workspace.owners.includes(user.id)
    )
    sharedWorkspaces = workspaces.filter(
      (workspace) => workspace.users && workspace.users.includes(user.id)
    )
  }

  // Render
  return (
    <Layout>
      <Layout.Sider theme="light" className="Dashboard-sider">
        <div className="logo">
          <img src="/images/logo.svg" />
        </div>

        <Menu
          theme="light"
          onSelect={onSelect}
          defaultSelectedKeys={['workspace1']}
          defaultOpenKeys={['1']}
          mode="inline"
        >
          <Menu.SubMenu
            key={menuItems.workspaces.key}
            icon={<AppstoreTwoTone />}
            title={menuItems.workspaces.label}
          >
            {myWorkspaces.map((workspace, index) => {
              return <Menu.Item key={index}>{workspace.name}</Menu.Item>
            })}
          </Menu.SubMenu>
          <Menu.SubMenu
            key={menuItems.shared.key}
            icon={<ShareAltOutlined />}
            title={menuItems.shared.label}
          >
            {sharedWorkspaces.map((workspace, index) => {
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
          <Menu.Divider />
        </Menu>

        <div className="Dashboard-profile">
          <Avatar size="large" icon={<UserOutlined />} />
          <p>{user && user.username}</p>
          <p>
            {user && user.firstname} {user && user.lastname}
          </p>
        </div>
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

export default DashboardPage
