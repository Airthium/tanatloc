/** @namespace Components.Index */

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Divider, Layout, Typography } from 'antd'
import { DashboardOutlined, LoginOutlined } from '@ant-design/icons'

import Background from '@/components/background'
import Wait from './wait'

import { Error as ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Errors
 * @memberof Components.Index
 */
const errors = {
  user: 'User error'
}

/**
 * Index
 * @memberof Components.Index
 */
const Index = () => {
  // Router
  const router = useRouter()

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()

  // Error
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
  }, [errorUser])

  // Prefetch
  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/signup')
    router.prefetch('/login')
  }, [])

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
        <img src="/images/logo.svg" alt="Tanatloc" />
        {!loadingUser && (
          <Button.Group>
            {user ? (
              <Button
                icon={<DashboardOutlined />}
                onClick={handleDashboard}
                size="large"
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSignup}
                  size="large"
                  style={{ border: 'none' }}
                >
                  Signup
                </Button>
                <Button
                  icon={<LoginOutlined />}
                  onClick={handleLogin}
                  size="large"
                  style={{ border: 'none' }}
                >
                  Login
                </Button>
              </>
            )}
          </Button.Group>
        )}
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
        <Layout style={{ width: '50%', margin: 'auto' }}>
          <Layout.Content>
            <Wait />
          </Layout.Content>
        </Layout>
        <p className="version">
          version: git-{process.env.NEXT_PUBLIC_SOURCE_BRANCH}-
          {process.env.NEXT_PUBLIC_SOURCE_COMMIT}
        </p>
      </Layout.Content>
    </Layout>
  )
}

export default Index
