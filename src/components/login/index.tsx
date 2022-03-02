/** @module Components.Login */

import { useRouter } from 'next/router'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
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

import Loading from '@/components/loading'
import { ErrorNotification } from '@/components/assets/notification'

import PasswordRecover from './password'

import { login } from '@/api/login'
import UserAPI from '@/api/user'

/**
 * Errors
 */
const errors = {
  user: 'User error',
  internal: 'Server issue : try again shortly.',
  credentials: 'Incorrect credentials.'
}

/**
 * Login
 * @returns Login
 */
const Login = (): JSX.Element => {
  // State
  const [checking, setChecking]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loginErr, setLoginErr]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [internalErr, setInternalErr]: [
    boolean,
    Dispatch<SetStateAction<boolean>>
  ] = useState(false)

  // Data
  const [user, { mutateUser, errorUser, loadingUser }] = UserAPI.useUser()

  // Router
  const router = useRouter()

  // Error
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
  }, [errorUser])

  // Already connected
  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user])

  // Prefetch
  useEffect(() => {
    router.prefetch('/signup')
    router.prefetch('/dashboard')
  }, [])

  /**
   * Handle login
   * @param values
   */
  const onLogin = async (values: {
    email: string
    password: string
  }): Promise<void> => {
    // State
    setChecking(true)
    setLoginErr(false)
    setInternalErr(false)

    // Check
    try {
      const loggedUser = await login(values)
      if (loggedUser.ok) {
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
      ErrorNotification(errors.internal, err, false)
    }
  }

  /**
   * Go to signup
   */
  const signUp = (): void => {
    router.push('/signup')
  }

  /**
   * Render
   */
  if (loadingUser || user) return <Loading />
  else
    return (
      <Layout>
        <Card bordered={false} className="Login">
          <Space direction="vertical" size="large" className="full-width">
            <div>
              <Typography.Title
                level={1}
                style={{ padding: 0, marginBottom: 16, fontWeight: 500 }}
              >
                Log In
              </Typography.Title>
              <Typography.Text>
                Your first time ?{' '}
                <Button type="link" onClick={signUp}>
                  Sign up
                </Button>
              </Typography.Text>
            </div>
            <Form requiredMark="optional" onFinish={onLogin} layout="vertical">
              {(loginErr || internalErr) && (
                <Alert
                  message={internalErr ? errors.internal : errors.credentials}
                  type="error"
                  showIcon
                  style={{
                    marginBottom: '16px'
                  }}
                />
              )}
              <Form.Item
                name="email"
                label="Your email address"
                rules={[{ required: true, message: 'Email is required' }]}
              >
                <Input placeholder="Email address" autoComplete="email" />
              </Form.Item>
              <Form.Item
                name="password"
                label="Your password"
                rules={[{ required: true, message: 'Password is required' }]}
                style={{ marginBottom: '14px' }}
              >
                <Input.Password
                  placeholder="Password"
                  autoComplete="current-password"
                />
              </Form.Item>
              <PasswordRecover />
              <Form.Item className="Login-submit">
                <Button type="primary" loading={checking} htmlType="submit">
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Layout>
    )
}

export default Login
