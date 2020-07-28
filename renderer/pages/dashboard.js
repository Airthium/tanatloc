import { useRouter } from 'next/router'
import { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreTwoTone,
  LogoutOutlined,
  QuestionCircleTwoTone,
  SettingTwoTone
} from '@ant-design/icons'
import ProjectList from '../components/project/list'

import { useDispatch, useSelector } from 'react-redux'
import { logout as reduxLogout } from '../store/auth/action'

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

export default () => {
  // State
  const [collapsed, setCollapsed] = useState(false)
  const [current, setCurrent] = useState(menuItems.projects.key)

  // Router
  const router = useRouter()

  // Redux
  const dispatch = useDispatch()

  // Props
  const { user } = useSelector((store) => store.auth)
  if (typeof window !== 'undefined' && !user.id) {
    // Go to login
    router.push('/login')
  }

  // Collpase
  const onCollapse = (collapsed) => {
    setCollapsed(collapsed)
  }

  const onSelect = ({ key }) => {
    if (key === '0') return

    if (key === menuItems.logout.key) logout()
    else setCurrent(key)
  }

  const logout = () => {
    dispatch(reduxLogout())
    router.push('/')
  }

  return (
    <Layout>
      <Layout.Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
      >
        <div className="logo">
          <img src="logo.svg" />
        </div>

        <Menu
          theme="light"
          defaultSelectedKeys={['projects']}
          onSelect={onSelect}
        >
          <Menu.Item key={'0'}>Hello {user.username}</Menu.Item>
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
