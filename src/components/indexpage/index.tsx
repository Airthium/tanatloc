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

  // Git version
  let gitVersion = ''
  if (
    process.env.NEXT_PUBLIC_SOURCE_BRANCH &&
    process.env.NEXT_PUBLIC_SOURCE_COMMIT
  )
    gitVersion =
      'git-' +
      process.env.NEXT_PUBLIC_SOURCE_BRANCH +
      '-' +
      process.env.NEXT_PUBLIC_SOURCE_COMMIT

  // Buttons
  let buttons = (
    <Button loading={true} size="large" style={{ border: 'none' }} />
  )
  if (!loadingUser)
    if (user)
      buttons = (
        <Button
          className="no-border"
          icon={<DashboardOutlined />}
          onClick={handleDashboard}
          size="large"
        >
          Dashboard
        </Button>
      )
    else
      buttons = (
        <>
          <Button className="no-border" onClick={handleSignup} size="large">
            Signup
          </Button>
          <Button
            className="no-border"
            icon={<LoginOutlined />}
            onClick={handleLogin}
            size="large"
          >
            Login
          </Button>
        </>
      )

  /**
   * Render
   */
  return (
    <Layout className="Index">
      <Background />
      <Layout.Header className="Index-header">
        <img src="/images/logo.svg" alt="Tanatloc" />
        <div>{buttons}</div>
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
        className="Index-content"
      >
        <Typography.Title>See the world the way it really is!</Typography.Title>

        <Divider />

        <div className="Index-cols">
          <div className="Index-row">
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
              cover={
                <TeamOutlined style={{ fontSize: '50px', padding: '20px' }} />
              }
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
          </div>
          <div className="Index-row">
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
                title={
                  <Typography.Text>Script template ready!</Typography.Text>
                }
              />
            </Card>
          </div>
        </div>
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
            version {packageJson.version} {gitVersion && <>({gitVersion})</>}
          </div>
        </Space>
      </Layout.Footer>
    </Layout>
  )
}

export default Index
