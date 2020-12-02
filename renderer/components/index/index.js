/** @module renderer/components/index */

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Divider, Layout, Menu } from 'antd'
import { DashboardOutlined, LoginOutlined } from '@ant-design/icons'

import Background from '../background'

import UserAPI from '../../../src/api/user'

const menuKeys = {
  dashboard: 'dashboard',
  signup: 'signup',
  login: 'login'
}

/**
 * Index
 */
const Index = () => {
  // Router
  const router = useRouter()

  // Data
  const [user] = UserAPI.useUser()

  // Prefetch
  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/signup')
    router.prefetch('/login')
  }, [])

  /**
   * On select
   * @param {data} data { key }
   */
  const onSelect = ({ key }) => {
    if (key === menuKeys.dashboard) handleDashboard()
    if (key == menuKeys.signup) handleSignup()
    if (key === menuKeys.login) handleLogin()
  }

  /**
   * Handle dashboard
   */
  const handleDashboard = () => {
    router.push('/dashboard')
  }

  /**
   * Handle signup
   */
  const handleSignup = () => {
    router.push('/signup')
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
        <Menu onSelect={onSelect} selectedkeys={[]} mode="horizontal">
          {user ? (
            <Menu.Item key={menuKeys.dashboard} icon={<DashboardOutlined />}>
              Dashboard
            </Menu.Item>
          ) : (
            <>
              <Menu.Item key={menuKeys.signup}>Signup</Menu.Item>
              <Menu.Item key={menuKeys.login} icon={<LoginOutlined />}>
                Login
              </Menu.Item>
            </>
          )}
        </Menu>
      </Layout.Header>
      <Divider className="Tanatloc-divider" />
      <Layout.Content></Layout.Content>
    </Layout>
  )
}

export default Index
