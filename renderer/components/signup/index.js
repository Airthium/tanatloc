/** @module renderer/components/signup */

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Typography
} from 'antd'

import Loading from '../loading'
// import Background from '../background'

import login from '../../../src/api/login'
import { useUser, add } from '../../../src/api/user'

const errors = {
  INTERNAL_ERROR: 'Server issue : try again shortly.',
  ALREADY_EXISTS: 'This email is already registered',
  PASSSWORDS_MISMATCH: 'Passwords mismatch'
}

/**
 * Signup
 */
const Signup = () => {
  // State
  const [checking, setChecking] = useState(false)
  const [passwordErr, setPasswordErr] = useState(false)
  const [signupErr, setSignupErr] = useState(false)
  const [loginErr, setLoginErr] = useState(false)
  const [internalErr, setInternalError] = useState(false)

  // Data
  const [user, { loadingUser, mutateUser }] = useUser()

  // Router
  const router = useRouter()

  // Already connected
  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user])

  // Prefetch
  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/login')
  }, [])

  /**
   * Handle signup
   * @param {Object} values { username, password, passwordConfirmation }
   */
  const onSignup = async ({ username, password, passwordConfirmation }) => {
    // State
    setChecking(true)
    setSignupErr(false)
    setInternalError(false)

    // Check passwords
    if (password !== passwordConfirmation) {
      setPasswordErr(true)
      setChecking(false)
      return
    }

    // Signup
    try {
      const newUser = await add({ username, password })
      if (newUser.alreadyExists) {
        setSignupErr(true)
        setChecking(true)
        return
      }

      router.push('/login')
    } catch (err) {
      setInternalError(true)
      setChecking(false)
      console.error(err)
    }
  }

  /**
   * Go to login
   */
  const login = () => {
    router.push('/login')
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
          {/* <Background /> */}
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
              <Form
                requiredMark="optional"
                onFinish={onSignup}
                layout="vertical"
              >
                {internalErr && (
                  <Alert
                    message={errors.INTERNAL_ERROR}
                    type="error"
                    showIcon
                    style={{
                      marginBottom: '16px'
                    }}
                  />
                )}
                <Form.Item
                  name="username"
                  label="Enter your email address"
                  rules={[
                    { required: true, message: 'Please enter your email' }
                  ]}
                  validateStatus={signupErr && 'warning'}
                  extra={
                    signupErr && (
                      <Card
                        size="small"
                        title="This email is already registered"
                        headStyle={{ color: '#faad14' }}
                      >
                        We know you!{' '}
                        <Button type="link" onClick={login}>
                          Log in ?
                        </Button>
                      </Card>
                    )
                  }
                >
                  <Input placeholder="Email address" autoComplete="email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Choose your password"
                  rules={[
                    { required: true, message: 'Please enter your Password' }
                  ]}
                  validateStatus={passwordErr && 'warning'}
                  style={{ marginBottom: '14px' }}
                >
                  <Input.Password
                    placeholder="Password"
                    autoComplete="current-password"
                  />
                </Form.Item>
                <Form.Item
                  name="passwordConfirmation"
                  label="Confirm your password"
                  rules={[
                    { required: true, message: 'Please enter your Password' }
                  ]}
                  validateStatus={passwordErr && 'warning'}
                  extra={
                    passwordErr && (
                      <Typography.Text type="warning">
                        {errors.PASSSWORDS_MISMATCH}
                      </Typography.Text>
                    )
                  }
                  style={{ marginBottom: '14px' }}
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
