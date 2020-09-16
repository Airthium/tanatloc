/** @module renderer/components/index */

import { useRouter } from 'next/router'
import { Divider, Layout, Menu } from 'antd'
import { DashboardOutlined, LoginOutlined } from '@ant-design/icons'

import Background from '../background'

import { useUser } from '../../../src/api/user'

const menuKeys = {
  dashboard: 'dashboard',
  login: 'login'
}

/**
 * Index
 */
const Index = () => {
  // Router
  const router = useRouter()

  // Data
  const [user] = useUser()

  /**
   * On select
   * @param {data} data { item, key }
   */
  const onSelect = ({ item, key }) => {
    if (key === menuKeys.dashboard) handleDashboard()
    if (key === menuKeys.login) handleLogin()
  }

  /**
   * Handle dashboard
   */
  const handleDashboard = () => {
    router.push('/dashboard')
  }

  /**
   * Handle login
   */
  const handleLogin = () => {
    router.push('/login')
  }

  /**
   * Render
   */
  return (
    <Layout className="Index">
      <Background />
      <Layout.Header className="Index-header">
        <img src="/images/logo.svg" />
        <Menu onSelect={onSelect} selectedkeys={[]}>
          {user ? (
            <Menu.Item key={menuKeys.dashboard} icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
          ) : (
            <Menu.Item key={menuKeys.login} icon={<LoginOutlined />}>
              Login
            </Menu.Item>
          )}
        </Menu>
      </Layout.Header>
      <Divider className="Index-divider" />
      <Layout.Content></Layout.Content>
    </Layout>
  )
}

export default Index
