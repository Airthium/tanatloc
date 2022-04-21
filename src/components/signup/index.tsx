/** @module Components.Signup */

import { NextRouter, useRouter } from 'next/router'
import { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Button, Card, Form, Input, Layout, Space, Typography } from 'antd'

import { INewUser } from '@/database/user/index'

import { PasswordItem } from '@/components/assets/input'
import { ErrorNotification, FormError } from '@/components/assets/notification'

import Loading from '@/components/loading'

import { APIError } from '@/api/error'
import UserAPI from '@/api/user'
import SystemAPI from '@/api/system'

/**
 * Errors
 */
export const errors = {
  user: 'User error',
  system: 'System error',
  internal: 'Server issue : try again shortly.',
  alreadyExists: 'This email is already registered',
  passwordMismatch: 'Passwords mismatch'
}

/**
 * Handle signup
 * @param router Router
 * @param values
 */
export const onSignup = async (
  router: NextRouter,
  values: {
    email: string
    password: string
  }
): Promise<void> => {
  // Signup
  let newUser: INewUser
  try {
    newUser = await UserAPI.add(values)
  } catch (err) {
    throw new APIError({ title: errors.internal, err })
  }

  if (newUser.alreadyExists)
    throw new APIError({
      title: errors.alreadyExists,
      render: (
        <>
          We know you! <a onClick={() => onLogin(router)}>Log in ?</a>
        </>
      ),
      type: 'warning'
    })

  router.push('/signup/send')
}

/**
 * Go to login
 * @param router Router
 */
export const onLogin = (router: NextRouter): void => {
  router.push('/login')
}

/**
 * Signup
 * @returns Signup
 */
const Signup = (): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [formError, setFormError]: [
    APIError,
    Dispatch<SetStateAction<APIError>>
  ] = useState()

  // Data
  const router = useRouter()
  const [user, { errorUser, loadingUser }] = UserAPI.useUser()
  const [system, { errorSystem, loadingSystem }] = SystemAPI.useSystem()

  // Errors
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
    if (errorSystem) ErrorNotification(errors.system, errorSystem)
  }, [errorUser, errorSystem])

  // Already connected
  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  // Prefetch
  useEffect(() => {
    router.prefetch('/dashboard')
    router.prefetch('/login')
  }, [router])

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
          <Space direction="vertical" size="large" className="full-width">
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
              onFinish={async (values) => {
                setLoading(true)
                try {
                  await onSignup(router, values)
                } catch (err) {
                  setFormError(err)
                } finally {
                  setLoading(false)
                }
              }}
              layout="vertical"
            >
              <Form.Item
                name="email"
                label="Enter your email address"
                rules={[{ required: true, message: 'Email is required' }]}
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
                  {
                    required: true,
                    message: 'Password confirmation is required'
                  },
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
              <FormError error={formError} />
              <Form.Item className="Signup-submit">
                <Button type="primary" loading={loading} htmlType="submit">
                  Finish
                </Button>
              </Form.Item>
            </Form>
          </Space>
        </Card>
      </Layout>
    )
}

Signup.propTypes = {}

export default Signup
