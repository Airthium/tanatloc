/** @module renderer/components/login */

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Typography,
  Alert
} from 'antd'

import Loading from '../loading'
//import Background from '../background'

import login from '../../../src/api/login'
import { useUser } from '../../../src/api/user'

/**
 * Login errors
 */
const errors = {
  INTERNAL_ERROR: 'Server issue : try again shortly.',
  BAD_CREDENTIALS: 'Incorrect credentials.'
}

/**
 * Login
 */
const Login = () => {
  // State
  const [checking, setChecking] = useState(false)
  const [loginErr, setLoginErr] = useState(false)
  const [internalErr, setInternalErr] = useState(false)

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

  /**
   * Handle login
   * @param {Object} values Values { username, password }
   */
  const onLogin = async (values) => {
    // State
    setChecking(true)
    setLoginErr(false)
    setInternalErr(false)

    // Check
    try {
      const loggedUser = await login(values)
      if (loggedUser) {
        // Logged
        mutateUser(loggedUser)
        router.push('/dashboard')
      } else {
        // Bad
        setLoginErr(true)
        setChecking(false)
      }
    } catch (err) {
      setInternalErr(true)
      setChecking(false)
      console.error(err)
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
        <Layout>
          {/*<Background />*/}
          <Card bordered={false} className="Login">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Typography.Title
                  level={1}
                  style={{ padding: 0, marginBottom: 16, fontWeight: 500 }}
                >
                  Log In
                </Typography.Title>
                <Typography.Text>
                  Your first time ? <a href="">Sign up</a>
                </Typography.Text>
              </div>
              <Form
                initialValues={{ remember: true }}
                requiredMark="optional"
                onFinish={onLogin}
                layout="vertical"
              >
                <Alert
                  message={
                    internalErr ? errors.INTERNAL_ERROR : errors.BAD_CREDENTIALS
                  }
                  type="error"
                  showIcon
                  style={{
                    marginBottom: '16px',
                    display: loginErr || internalErr ? 'block' : 'none'
                  }}
                />
                <Form.Item
                  name="username"
                  label="Your email address"
                  rules={[
                    { required: true, message: 'Please enter your email' }
                  ]}
                >
                  <Input placeholder="Email address" autoComplete="email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Your password"
                  rules={[
                    { required: true, message: 'Please enter your Password' }
                  ]}
                  style={{ marginBottom: '14px' }}
                >
                  <Input.Password
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                </Form.Item>
                <Typography.Text>
                  <a href="">Forgot your password ?</a>
                </Typography.Text>
                <Form.Item className="Login-submit">
                  <Button type="primary" loading={checking} htmlType="submit">
                    Log in
                  </Button>
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
