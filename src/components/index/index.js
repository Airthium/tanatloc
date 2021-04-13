/** @module components/index */

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Divider, Layout, Menu, Typography } from 'antd'
import { DashboardOutlined, LoginOutlined } from '@ant-design/icons'

import Background from '@/components/background'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Menu keys
 */
const menuKeys = {
  dashboard: 'dashboard',
  signup: 'signup',
  login: 'login'
}

/**
 * Errors
 */
const errors = {
  user: 'User error'
}

/**
 * Index
 */
const Index = () => {
  // Router
  const router = useRouter()

  // Data
  const [user, { errorUser }] = UserAPI.useUser()

  // Error
  useEffect(() => {
    if (errorUser) Error(errors.user, errorUser)
  }, [errorUser])

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
      <Layout.Content>
        <Layout style={{ margin: '20px' }}>
          <Layout.Content
            style={{
              backgroundColor: 'white',
              opacity: 0.5,
              padding: '20px'
            }}
          >
            <Typography.Title>
              See the world the way it really is!
            </Typography.Title>
          </Layout.Content>
        </Layout>
      </Layout.Content>
    </Layout>
  )
}

export default Index
