import { useRouter } from 'next/router'
import { useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
const { SubMenu } = Menu;
const { Title } = Typography;
import {
  AppstoreTwoTone,
  LogoutOutlined,
  QuestionCircleTwoTone,
  SettingTwoTone,
  ShareAltOutlined
} from '@ant-design/icons'
import ProjectList from '../../components/project/list'

import { useDispatch, useSelector } from 'react-redux'
import { logout as reduxLogout } from '../../store/auth/action'

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
const Account = () => {
  return <div>Account</div>
}

// TODO
const Help = () => {
  return <div>Help</div>
}

const redColor = '#0096C7'

export default () => {
  // State
  const [current, setCurrent] = useState(menuItems.workspaces.key)

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
      >
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
          <SubMenu key={menuItems.workspaces.key} icon={<AppstoreTwoTone twoToneColor={redColor}/>} title={menuItems.workspaces.label}>
            <Menu.Item key="workspace1">Home</Menu.Item>
            <Menu.Item key="workspace2">Airthium</Menu.Item>
          </SubMenu>
          <SubMenu key={menuItems.shared.key} icon={<ShareAltOutlined />} title={menuItems.shared.label}>
            <Menu.Item key="workspace3">Denso</Menu.Item>
            <Menu.Item key="workspace4">Micado Micado Nicado</Menu.Item>
          </SubMenu>
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

      <Layout className="no-scroll">
        {current === menuItems.workspaces.key && <ProjectList />}
        {current === menuItems.account.key && <Account />}
        {current === menuItems.help.key && <Help />}
      </Layout>
    </Layout>
  )
}
