/** @module Components.Index */

import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Card, Divider, Layout, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  LoginOutlined,
  TeamOutlined
} from '@ant-design/icons'

import packageJson from '../../../package.json'

import Background from '@/components/background'

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
const Index = (): JSX.Element => {
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
  const handleDashboard = (): void => {
    router.push('/dashboard')
  }

  /**
   * Handle signup
   */
  const handleSignup = (): void => {
    router.push('/signup')
  }

  /**
   * Handle login
   */
  const handleLogin = (): void => {
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
                style={{ border: 'none' }}
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
      <Divider
        style={{
          margin: '24px 10px',
          borderColor: 'grey',
          borderWidth: '2px',
          width: 'unset',
          minWidth: 'unset'
        }}
      />
      <Layout.Content
        style={{
          margin: '0 10px',
          padding: '20px',
          backgroundColor: 'white',
          overflow: 'auto'
        }}
      >
        <Typography.Title>See the world the way it really is!</Typography.Title>

        <Divider />

        <Space wrap>
          <Card
            className="Index-card"
            hoverable
            cover={<img alt="Tanatloc" src="/images/Tanatloc.png" />}
          >
            <Card.Meta
              title={
                <Typography.Text>Easy simulation playground!</Typography.Text>
              }
              description={
                <Typography.Text>
                  Complete configuration using graphic interface
                </Typography.Text>
              }
            />
          </Card>
          <Card
            className="Index-card"
            hoverable
            cover={<TeamOutlined style={{ fontSize: '50px' }} />}
          >
            <Card.Meta
              title={
                <Typography.Text>User, group, organization!</Typography.Text>
              }
              description={
                <Typography.Text>Manage your team easily</Typography.Text>
              }
            />
          </Card>
          <Card
            className="Index-card"
            hoverable
            cover="$$\int_{\Omega}\nabla u\nabla v$$"
          >
            <Card.Meta
              title={
                <Typography.Text>Already available models!</Typography.Text>
              }
              description={
                <Typography.Text>
                  Fluid mechanics, solid mechanics, thermic, ...
                </Typography.Text>
              }
            />
          </Card>
          <Card
            className="Index-card coming-soon"
            hoverable
            cover="$$\int_{\Omega}\nabla u\nabla v$$"
          >
            <Card.Meta
              title={<Typography.Text>Custom model editor!</Typography.Text>}
              description={<Typography.Text>Coming soon</Typography.Text>}
            />
          </Card>
          <Card
            className="Index-card"
            hoverable
            cover={
              <img
                alt="FreeFEM"
                src="/images/FreeFEM.svg"
                style={{ paddingRight: '20px' }}
              />
            }
          >
            <Card.Meta
              title={
                <Typography.Text>
                  Powered by{' '}
                  <Button
                    type="link"
                    href="https://freefem.org/"
                    target="_blank"
                  >
                    FreeFEM
                  </Button>
                  !
                </Typography.Text>
              }
              description="Finite element engine"
            />
          </Card>
          <Card
            className="Index-card"
            hoverable
            cover={
              <Typography.Title style={{ textAlign: 'center' }}>
                &lt;%= %&gt;
              </Typography.Title>
            }
          >
            <Card.Meta
              title={<Typography.Text>Script template ready!</Typography.Text>}
            />
          </Card>
        </Space>
      </Layout.Content>
      <Layout.Footer style={{ background: 'none' }}>
        <Space
          split={<Divider type="vertical" style={{ borderColor: 'grey' }} />}
        >
          <div>
            Tanatloc<sup>&copy;</sup> {new Date().getFullYear()} all rights
            reserved
          </div>
          <div>
            version {packageJson.version} (git-
            {process.env.NEXT_PUBLIC_SOURCE_BRANCH}-
            {process.env.NEXT_PUBLIC_SOURCE_COMMIT})
          </div>
        </Space>
      </Layout.Footer>
    </Layout>
  )
}

export default Index