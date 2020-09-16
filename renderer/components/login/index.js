/** @module renderer/components/login */

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  message,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Menu,
  Space
} from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import Loading from '../loading'
import Background from '../background'

import login from '../../../src/api/login'
import { useUser } from '../../../src/api/user'

/**
 * Login errors
 */
const errors = {
  BAD_CREDENTIALS: 'Login failed. Please check your username and password'
}

const menuKeys = {
  home: 'home'
}

/**
 * Login
 */
const Login = () => {
  // State
  const [checking, setChecking] = useState(false)

  // Data
  const [user, { mutateUser, loadingUser }] = useUser()

  // Router
  const router = useRouter()

  // Already connected
  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user])

  // Prefetch
  useEffect(() => {
    router.prefetch('/dashboard')
  }, [])

  const onSelect = ({ item, key }) => {
    if (key === menuKeys.home) handleHome()
  }

  const handleHome = () => {
    router.push('/')
  }

  /**
   * Handle login
   * @param {Object} values Values { username, password }
   */
  const onLogin = async (values) => {
    // State
    setChecking(true)

    // Check
    const loggedUser = await login(values)
    if (loggedUser) {
      // Logged
      mutateUser(loggedUser)
      router.push('/dashboard')
    } else {
      // Bad
      message.error(errors.BAD_CREDENTIALS)
      setChecking(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      {loadingUser || user ? (
        <Loading />
      ) : (
        <Layout className="tanatloc-gradient">
          <Background />
          <Layout.Header className="Login-header">
            <Menu onSelect={onSelect} selectedkeys={[]}>
              <Menu.Item key={menuKeys.home} icon={<HomeOutlined />}>
                Home
              </Menu.Item>
            </Menu>
          </Layout.Header>
          <Card className="Login">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div className="logo">
                <img src="/images/logo.svg" />
              </div>
              <Form initialValues={{ remember: true }} onFinish={onLogin}>
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: 'Please fill your Username!' }
                  ]}
                >
                  <Input placeholder="username" autoComplete="username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please fill your Password!' }
                  ]}
                >
                  <Input.Password
                    placeholder="password"
                    autoComplete="current-password"
                  />
                </Form.Item>
                <Form.Item>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>remember me</Checkbox>
                  </Form.Item>

                  <a className="Login-forgot" href="">
                    forgot password
                  </a>
                </Form.Item>
                <Form.Item className="Login-submit">
                  <Button type="primary" loading={checking} htmlType="submit">
                    Log in
                  </Button>
                  <a href="">or register now!</a>
                </Form.Item>
              </Form>
            </Space>
          </Card>
        </Layout>
      )}
    </>
  )
}

export default Login
