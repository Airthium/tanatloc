/** @module 'src/components/signup */

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

import Loading from '@/components/loading'
// import Background from '../background'

import login from '@/api/login'
import UserAPI from '@/api/user'

import Sentry from '@/lib/sentry'

/**
 * Errors
 */
const errors = {
  INTERNAL_ERROR: 'Server issue : try again shortly.',
  ALREADY_EXISTS: 'This email is already registered',
  PASSWORD_TOO_SMALL: 'Your password is too small',
  PASSWORD_TOO_LONG: 'Your password is too long',
  PASSSWORDS_MISMATCH: 'Passwords mismatch'
}

/**
 * Signup
 */
const Signup = () => {
  // State
  const [checking, setChecking] = useState(false)
  const [signupErr, setSignupErr] = useState(false)
  const [internalErr, setInternalError] = useState(false)

  // Data
  const [user, { loadingUser, mutateUser }] = UserAPI.useUser()

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

    // Signup
    try {
      throw new Error('not authorized yet!')
      const newUser = await UserAPI.add({ username, password })
      if (newUser.alreadyExists) {
        setSignupErr(true)
        setChecking(false)
        return
      }

      // Login
      const loggedUser = await login({ username, password })
      mutateUser(loggedUser)
      router.push('/dashboard')
    } catch (err) {
      setInternalError(true)
      setChecking(false)
      console.error(err)
      Sentry.captureException(err)
    }
  }

  /**
   * Go to login
   */
  const onLogin = () => {
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
                {(signupErr || internalErr) && (
                  <Alert
                    message={
                      internalErr ? (
                        errors.INTERNAL_ERROR
                      ) : (
                        <>
                          <b type="warning">{errors.ALREADY_EXISTS}</b>
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
                  name="username"
                  label="Enter your email address"
                  rules={[
                    { required: true, message: 'Please enter your email' }
                  ]}
                >
                  <Input placeholder="Email address" autoComplete="email" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label="Choose your password"
                  rules={[
                    { required: true, message: 'Please enter your Password' },
                    { min: 6, message: errors.PASSWORD_TOO_SMALL },
                    { max: 16, message: errors.PASSWORD_TOO_LONG }
                  ]}
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
                    { required: true, message: 'Please enter your Password' },
                    ({ getFieldValue }) => ({
                      validator(rule, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve()
                        }
                        return Promise.reject(errors.PASSSWORDS_MISMATCH)
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
      )}
    </>
  )
}

export default Signup
