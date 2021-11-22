/** @namespace Components.Signup */

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

import { PasswordItem } from '@/components/assets/input'
import { Error as ErrorNotification } from '@/components/assets/notification'

import Loading from '@/components/loading'

import UserAPI from '@/api/user'
import SystemAPI from '@/api/system'

/**
 * Errors
 * @memberof Components.Signup
 */
const errors = {
  user: 'User error',
  system: 'System error',
  INTERNAL_ERROR: 'Server issue : try again shortly.',
  ALREADY_EXISTS: 'This email is already registered',
  passwordMismatch: 'Passwords mismatch',
  systemError: 'Unable to get system'
}

/**
 * Signup
 * @memberof Components.Signup
 */
const Signup = (): JSX.Element => {
  // State
  const [checking, setChecking]: [boolean, Function] = useState(false)
  const [signupErr, setSignupErr]: [boolean, Function] = useState(false)
  const [internalErr, setInternalError]: [boolean, Function] = useState(false)

  // Data
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()
  const [system, { errorSystem, loadingSystem }] = SystemAPI.useSystem()

  // Router
  const router = useRouter()

  // Errors
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
    if (errorSystem) ErrorNotification(errors.system, errorSystem)
  }, [errorUser, errorSystem])

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
   * @param values
   */
  const onSignup = async (values: {
    email: string
    password: string
  }): Promise<void> => {
    // State
    setChecking(true)
    setSignupErr(false)
    setInternalError(false)

    // Signup
    try {
      const newUser = await UserAPI.add(values)
      if (newUser.alreadyExists) {
        setSignupErr(true)
        setChecking(false)
        return
      }

      router.push('/signup/send')
    } catch (err) {
      setInternalError(true)
      setChecking(false)
      ErrorNotification(errors.INTERNAL_ERROR, err, false)
    }
  }

  /**
   * Go to login
   */
  const onLogin = (): void => {
    router.push('/login')
  }

  /**
   * Render
   */
  if (loadingUser || loadingSystem || user) return <Loading />
  else if (!system?.allowsignup)
    return (
      <Layout>
        <Card className="Signup">The server does not allow signup for now</Card>
      </Layout>
    )
  else
    return (
      <Layout>
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
            <Form requiredMark="optional" onFinish={onSignup} layout="vertical">
              {(signupErr || internalErr) && (
                <Alert
                  message={
                    internalErr ? (
                      errors.INTERNAL_ERROR
                    ) : (
                      <>
                        <b>{errors.ALREADY_EXISTS}</b>
                        <br />
                        We know you!{' '}
                        <Button type="link" onClick={onLogin}>
                          Log in ?
                        </Button>
                      </>
                    )
                  }
                  type={internalErr ? 'error' : 'warning'}
                  showIcon
                  style={{
                    marginBottom: '16px'
                  }}
                />
              )}
              <Form.Item
                name="email"
                label="Enter your email address"
                rules={[{ required: true, message: 'Please enter your email' }]}
              >
                <Input placeholder="Email address" autoComplete="email" />
              </Form.Item>
              <PasswordItem
                name="password"
                label="Choose your password"
                inputPlaceholder="Password"
                inputAutoComplete="current-password"
                style={{ marginBottom: '14px' }}
              />
              <Form.Item
                name="passwordConfirmation"
                label="Confirm your password"
                rules={[
                  { required: true, message: 'Please enter your Password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(errors.passwordMismatch)
                    }
                  })
                ]}
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
    )
}

export default Signup
