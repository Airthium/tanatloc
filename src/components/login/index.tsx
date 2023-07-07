/** @module Components.Login */

import { useRouter } from 'next/router'
import { useState, useEffect, useCallback, useContext, useRef } from 'react'
import { Button, Card, Form, Input, Layout, Space, Typography } from 'antd'
import isElectron from 'is-electron'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import Loading from '@/components/loading'
import { FormError } from '@/components/assets/notification'

import { IFrontUser } from '@/api/index.d'
import { APIError } from '@/api/error'
import { login } from '@/api/login'
import UserAPI from '@/api/user'

import PasswordRecover from './password'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Errors
 */
export const errors = {
  user: 'Error while loading user',
  internal: 'Server issue : please try again shortly',
  credentials: 'Incorrect credentials'
}

/**
 * Handle login
 * @param values
 * @param mutateUser Mutate user
 */
export const _onLogin = async (
  values: {
    email: string
    password: string
  },
  mutateUser: (user: Partial<IFrontUser>) => Promise<void>
): Promise<void> => {
  // Check
  let loggedUser: { ok: boolean; id?: string; isvalidated?: boolean }
  try {
    loggedUser = await login(values)
  } catch (err: any) {
    throw new APIError({ title: errors.internal, err })
  }

  if (loggedUser.ok) {
    // Logged
    await mutateUser({ id: loggedUser.id })
  } else {
    // Bad
    throw new APIError({ title: errors.credentials, type: 'warning' })
  }
}

/**
 * Login
 * @returns Login
 */
const Login = (): React.JSX.Element => {
  // Ref
  const justOne = useRef<number>(0)

  // State
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<APIError>()

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const [user, { mutateUser, errorUser, loadingUser }] = UserAPI.useUser()

  // Router
  const router = useRouter()

  // Electron
  useEffect(() => {
    ;(async () => {
      if (isElectron()) {
        try {
          await login({
            email: 'admin',
            password: 'password'
          })
          await router.push('/dashboard')
        } catch (err) {}
      }
    })()
  }, [router])

  // Error
  useEffect(() => {
    if (errorUser) dispatch(addError({ title: errors.user, err: errorUser }))
  }, [errorUser, dispatch])

  /**
   * Dashboard
   */
  const dashboard = useCallback(() => {
    ;(async () => {
      await router.push('/dashboard')
    })()
  }, [router])

  // Already connected
  useEffect(() => {
    if (user) {
      if (justOne.current) return

      justOne.current++
      dashboard()
    }
  }, [user, dashboard])

  /**
   * Signup
   */
  const signup = useCallback((): void => {
    ;(async () => {
      await router.push('/signup')
    })()
  }, [router])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = useCallback(
    (values: { email: string; password: string }): void => {
      ;(async () => {
        setLoading(true)
        try {
          await _onLogin(values, mutateUser)
        } catch (err) {
          setFormError(err as APIError)
          setLoading(false)
        }
      })()
    },
    [mutateUser]
  )

  /**
   * Render
   */
  if (loadingUser || user) return <Loading />
  return (
    <Layout>
      <Card bordered={false} className={style.login}>
        <Space
          direction="vertical"
          size="large"
          className={globalStyle.fullWidth}
        >
          <div>
            <Typography.Title
              level={1}
              style={{ padding: 0, marginBottom: 16, fontWeight: 500 }}
            >
              Log In
            </Typography.Title>
            <Typography.Text>
              Your first time ?{' '}
              <Button type="link" onClick={signup}>
                Sign up
              </Button>
            </Typography.Text>
          </div>
          <Form requiredMark="optional" onFinish={onFinish} layout="vertical">
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
            <Form.Item className={style.submit}>
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

export default Login
