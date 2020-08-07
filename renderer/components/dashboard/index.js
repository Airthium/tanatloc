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

const DashboardPage = () => {
  // State
  const [currentView, setCurrentView] = useState(menuItems.workspaces.key)
  const [currentWorkspace, setCurrentWorkspace] = useState()
  const [myWorkspaces, setMyWorkspaces] = useState([])
  const [sharedWorkspaces, setSharedWorkspaces] = useState([])

  const [user, { mutateUser, loadingUser }] = useUser()
  const [workspaces] = useWorkspace()

  // Router
  const router = useRouter()

  // Workspaces
  const sortWorkspaces = () => {
    if (workspaces && user) {
      setMyWorkspaces(
        workspaces.filter(
          (workspace) => workspace.owners && workspace.owners.includes(user.id)
        )
      )
      setSharedWorkspaces(
        workspaces.filter(
          (workspace) => workspace.users && workspace.users.includes(user.id)
        )
      )
    }
  }

  // Menu
  const onSelect = ({ item, key }) => {
    const subMenuKey = item.props.subMenuKey.replace('-menu-', '')

    // In a submenu
    if (subMenuKey === menuItems.workspaces.key) {
      setCurrentView(subMenuKey)
      const workspaceKey = key.replace(menuItems.workspaces.key, '')
      const workspace = myWorkspaces[workspaceKey]
      setCurrentWorkspace({
        index: workspaceKey,
        type: menuItems.workspaces.label,
        ...workspace
      })
    } else if (subMenuKey === menuItems.shared.key) {
      // Shared with me workspaces
      setCurrentView(subMenuKey)
      const sharedKey = key.replace(menuItems.shared.key, '')
      const workspace = sharedWorkspaces[sharedKey]
      setCurrentWorkspace({
        index: sharedKey,
        type: menuItems.shared.label,
        ...workspace
      })
    } else {
      if (key === menuItems.logout.key) handleLogout()
      else setCurrentView(key)
    }
  }

  // Logout
  const handleLogout = async () => {
    await logout()
    mutateUser({ user: null })
  }

  // Not logged
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  // Workspace
  useEffect(() => {
    sortWorkspaces()
  }, [workspaces, user])

  // Default workspace
  useEffect(() => {
    if (!currentWorkspace) {
      if (myWorkspaces.length) {
        setCurrentView(menuItems.workspaces.key)
        setCurrentWorkspace({
          index: 0,
          type: menuItems.workspaces.label,
          ...myWorkspaces[0]
        })
      } else if (sharedWorkspaces.length) {
        setCurrentView(menuItems.shared.key)
        setCurrentWorkspace({
          index: 0,
          type: menuItems.shared.label,
          ...sharedWorkspaces[0]
        })
      }
    } else {
      const index = currentWorkspace.index
      const type = currentWorkspace.type
      let testWorkspace
      if (type === menuItems.workspaces.label) {
        testWorkspace = myWorkspaces[index]
      } else if (type === menuItems.shared.label) {
        testWorkspace = sharedWorkspaces[index]
      }

      if (currentWorkspace !== testWorkspace)
        setCurrentWorkspace({
          index: index,
          type: type,
          ...testWorkspace
        })
    }
  }, [myWorkspaces, sharedWorkspaces])

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
          defaultOpenKeys={[menuItems.workspaces.key, menuItems.shared.key]}
          mode="inline"
        >
          <Menu.SubMenu
            key={menuItems.workspaces.key}
            icon={<AppstoreTwoTone />}
            title={menuItems.workspaces.label}
          >
            {myWorkspaces.map((workspace, index) => {
              return (
                <Menu.Item key={menuItems.workspaces.key + index}>
                  {workspace.name}
                </Menu.Item>
              )
            })}
          </Menu.SubMenu>
          <Menu.SubMenu
            key={menuItems.shared.key}
            icon={<ShareAltOutlined />}
            title={menuItems.shared.label}
          >
            {sharedWorkspaces.map((workspace, index) => {
              return (
                <Menu.Item key={menuItems.shared.key + index}>
                  {workspace.name}
                </Menu.Item>
              )
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
