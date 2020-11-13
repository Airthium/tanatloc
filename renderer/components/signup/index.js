/** @module renderer/components/signup */

import { useRouter } from 'next/router'
import { /*useState,*/ useEffect } from 'react'
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Typography,
  Popover
} from 'antd'

import Loading from '../loading'
import Background from '../background'

import { useUser } from '../../../src/api/user'

/**
 * Signup
 */
const Signup = () => {
  // State
  // const [checking, setChecking] = useState(false)
  const checking = false

  // Data
  const [user, { loadingUser }] = useUser()

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
   * Render
   */
  return (
    <>
      {loadingUser || user ? (
        <Loading />
      ) : (
        <Layout>
          <Background />
          <Card bordered={false} className="Signup">
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Typography.Title
                  level={1}
                  style={{ padding: 0, marginBottom: 16, fontWeight: 500 }}
                >
                  Sign Up
                </Typography.Title>
              </div>
              <Form initialValues={{ remember: true }} layout="vertical">
                {/*
                TODO We have 2 cases to handle
              1) The user forgot to enter a value in the email or password field => validateStatus=error
              2) The user enters the wrong credentials => the fields keep the default border color and we show an Alert component
              */}
                <Form.Item
                  name="username"
                  label="Enter your email address"
                  rules={[{ message: 'Please enter your email' }]}
                  hasFeedback
                  validateStatus="warning"
                >
                  <Popover
                    placement="right"
                    content={
                      <span>
                        We know you! <a>Log in ?</a>
                      </span>
                    }
                    title="This email is already registered"
                    trigger="click"
                    visible={true}
                  >
                    <Input placeholder="Email address" autoComplete="email" />
                  </Popover>
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Choose your password"
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
                <Form.Item
                  name="password-confirmation"
                  label="Confirm your password"
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
                <Form.Item className="Signup-submit">
                  <Button type="primary" loading={checking} htmlType="submit">
                    Finish
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

export default Signup
