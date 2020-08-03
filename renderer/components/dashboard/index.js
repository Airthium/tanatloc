import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreTwoTone,
  LogoutOutlined,
  QuestionCircleTwoTone,
  SettingTwoTone
} from '@ant-design/icons'
import ProjectList from '../../components/project/list'

import { useUser } from '../../../src/auth/useUser'

import logout from '../../../src/api/logout'

const menuItems = {
  projects: {
    label: 'My Projects',
    key: '1'
  },
  account: {
    label: 'Account Settings',
    key: '2'
  },
  help: {
    label: 'I Need Help',
    key: '3'
  },
  logout: {
    label: 'Logout',
    key: '4'
  }
}

// TODO
const Account = () => {
  return <div>Account</div>
}

// TODO
const Help = () => {
  return <div>Help</div>
}

const DashboardPage = () => {
  // State
  const [collapsed, setCollapsed] = useState(false)
  const [current, setCurrent] = useState(menuItems.projects.key)

  const [user, { mutate, loading }] = useUser()

  // Router
  const router = useRouter()

  // Collpase
  const onCollapse = (isCollapsed) => {
    setCollapsed(isCollapsed)
  }

  const onSelect = ({ key }) => {
    if (key === '0') return

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
      <Layout.Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo">
          <img src="/images/logo.svg" />
        </div>

        <Menu
          theme="light"
          defaultSelectedKeys={['projects']}
          onSelect={onSelect}
        >
          <Menu.Item key={'0'}>Hello {user && user.username}</Menu.Item>
          <Menu.Divider />
          <Menu.Item key={menuItems.projects.key} icon={<AppstoreTwoTone />}>
            {menuItems.projects.label}
          </Menu.Item>
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

      <Layout className="bg-yellow no-scroll">
        {current === menuItems.projects.key && <ProjectList />}
        {current === menuItems.account.key && <Account />}
        {current === menuItems.help.key && <Help />}
      </Layout>
    </Layout>
  )
}

export default DashboardPage
