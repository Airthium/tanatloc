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
  BAD_CREDENTIALS: 'Login failed. Please check your username and password'
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
        <Layout className="">
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
                onFinish={onLogin}
                layout="vertical"
              >
                <Alert
                  message="Incorrect credentials."
                  type="error"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
                {/*
                TODO We have 2 cases to handle
              1) The user forgot to enter a value in the email or password field => validateStatus=error
              2) The user enters the wrong credentials => the fields keep the default border color and we show an Alert component
              */}
                <Form.Item
                  name="username"
                  label="Your email address"
                  rules={[{ message: 'Please enter your email' }]}
                  hasFeedback
                  validateStatus="error"
                >
                  <Input placeholder="Email address" autoComplete="email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Your password"
                  rules={[{ message: 'Please enter your Password' }]}
                  style={{ marginBottom: '14px' }}
                  hasFeedback
                  validateStatus="error"
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
