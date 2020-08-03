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
import ProjectList from '../../components/project/list'

import { useUser } from '../../../src/auth/useUser'
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
  const [current, setCurrent] = useState(menuItems.workspaces.key)

  const [user, { mutate, loading }] = useUser()

  // Router
  const router = useRouter()

  const onSelect = ({ key }) => {
    if (key === menuItems.logout.key) handleLogout()
    else setCurrent(key)
  }

  const handleLogout = async () => {
    await logout()
    mutate({ user: null })
  }

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
  }, [user, loading])

  return (
    <Layout>
      <Layout.Sider theme="light">
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
            <Menu.Item key="workspace1">Home</Menu.Item>
            <Menu.Item key="workspace2">Airthium</Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key={menuItems.shared.key}
            icon={<ShareAltOutlined />}
            title={menuItems.shared.label}
          >
            <Menu.Item key="workspace3">Denso</Menu.Item>
            <Menu.Item key="workspace4">Micado Micado Nicado</Menu.Item>
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
      </Layout.Sider>

      <Layout.Content className="no-scroll">
        {current === menuItems.workspaces.key && <ProjectList />}
        {current === menuItems.account.key && <Account />}
        {current === menuItems.help.key && <Help />}
      </Layout.Content>
    </Layout>
  )
}

export default DashboardPage
