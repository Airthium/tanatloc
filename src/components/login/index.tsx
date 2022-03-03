/** @module Components.Login */

import { NextRouter, useRouter } from 'next/router'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Button, Card, Form, Input, Layout, Space, Typography } from 'antd'

import { IUserWithData } from '@/lib/index.d'

import Loading from '@/components/loading'
import { ErrorNotification, FormError } from '@/components/assets/notification'

import PasswordRecover from './password'

import { login } from '@/api/login'
import UserAPI from '@/api/user'
import { APIError } from '@/api/error'

/**
 * Errors
 */
const errors = {
  user: 'User error',
  internal: 'Server issue : try again shortly.',
  credentials: 'Incorrect credentials.'
}

/**
 * Handle login
 * @param router Router
 * @param values
 * @param mutateUser Mutate user
 */
const onLogin = async (
  router: NextRouter,
  values: {
    email: string
    password: string
  },
  mutateUser: (user: IUserWithData) => void
): Promise<void> => {
  // Check
  let loggedUser: { ok: boolean; id?: string; isvalidated?: boolean }
  try {
    loggedUser = await login(values)
  } catch (err) {
    throw new APIError({ title: errors.internal, err })
  }

  if (loggedUser.ok) {
    // Logged
    mutateUser(loggedUser)
    router.push('/dashboard')
  } else {
    // Bad
    throw new APIError({ title: errors.credentials, type: 'warning' })
  }
}

/**
 * Go to signup
 * @param router Router
 */
const signUp = (router: NextRouter): void => {
  router.push('/signup')
}

/**
 * Login
 * @returns Login
 */
const Login = (): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [formError, setFormError]: [
    APIError,
    Dispatch<SetStateAction<APIError>>
  ] = useState()

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
  }, [user, router])

  // Prefetch
  useEffect(() => {
    router.prefetch('/signup')
    router.prefetch('/dashboard')
  }, [router])

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
                <Button type="link" onClick={() => signUp(router)}>
                  Sign up
                </Button>
              </Typography.Text>
            </div>
            <Form
              requiredMark="optional"
              onFinish={async (values) => {
                setLoading(true)
                try {
                  await onLogin(router, values, mutateUser)
                } catch (err) {
                  setFormError(err)
                  setLoading(false)
                }
              }}
              layout="vertical"
            >
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
              <FormError error={formError} />
              <Form.Item className="Login-submit">
                <Button type="primary" loading={loading} htmlType="submit">
                  Log in
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Layout>
    )
}

Login.propTypes = {}

export default Login
