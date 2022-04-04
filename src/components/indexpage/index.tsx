/** @module Components.Index */

import { NextRouter, useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button, Card, Divider, Layout, Space, Typography } from 'antd'
import {
  DashboardOutlined,
  LoginOutlined,
  TeamOutlined
} from '@ant-design/icons'

import packageJson from '../../../package.json'

import { ErrorNotification } from '@/components/assets/notification'
import MathJax from '@/components/assets/mathjax'

import Utils from '@/lib/utils'

import UserAPI from '@/api/user'

/**
 * Errors
 */
export const errors = {
  user: 'User error'
}

/**
 * Handle dashboard
 * @param router Router
 */
export const handleDashboard = (router: NextRouter): void => {
  router.push('/dashboard')
}

/**
 * Handle signup
 * @param router Router
 */
export const handleSignup = (router: NextRouter): void => {
  router.push('/signup')
}

/**
 * Handle login
 * @param router Router
 */
export const handleLogin = (router: NextRouter): void => {
  router.push('/login')
}

/**
 * Index
 * @returns Index
 */
const Index = (): JSX.Element => {
  // Router
  const router = useRouter()

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()

  // Error
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser, false)
  }, [errorUser])

  // Prefetch
  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/signup')
    router.prefetch('/login')
  }, [router])

  // Git version
  const gitVersion = Utils.getGitVersion()

  // Buttons
  let buttons = <Button className="no-border" loading={true} size="large" />
  if (!loadingUser)
    if (user)
      buttons = (
        <Button
          className="no-border"
          icon={<DashboardOutlined />}
          onClick={() => handleDashboard(router)}
          size="large"
        >
          Dashboard
        </Button>
      )
    else
      buttons = (
        <>
          <Button
            className="no-border"
            onClick={() => handleSignup(router)}
            size="large"
          >
            Signup
          </Button>
          <Button
            className="no-border"
            icon={<LoginOutlined />}
            onClick={() => handleLogin(router)}
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
      <Layout.Header className="Index-header">
        <img src="/images/logo.svg" alt="Tanatloc" />
        <div>{buttons}</div>
      </Layout.Header>
      <Divider
        style={{
          margin: '12px 10px 24px 10px',
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
              cover={
                <MathJax.Formula text={'\\int_{\\Omega}\\nabla u\\nabla v'} />
              }
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

Index.propTypes = {}

export default Index
