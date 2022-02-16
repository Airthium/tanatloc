/** @module Components.Password */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Spin,
  Typography
} from 'antd'

import { PASSWORD_RECOVERY } from '@/config/email'

import { PasswordItem } from '@/components/assets/input'
import { Error as ErrorNotification } from '@/components/assets/notification'

import LinkAPI from '@/api/link'

/**
 * Errors
 * @memberof Components.Password
 */
const errors = {
  internal: 'Internal error, please try again later',
  passwordMismatch: 'Passwords mismatch'
}

/**
 * Password recovery
 * @memberof Components.Password
 */
const PasswordRecovery = (): JSX.Element => {
  // State
  const [checking, setChecking]: [boolean, Function] = useState(true)
  const [linkEmail, setLinkEmail]: [string, Function] = useState()
  const [loading, setLoading]: [boolean, Function] = useState(false)

  // Data
  const router = useRouter()

  // Id
  const { id }: { id?: string } = router.query

  // Check link type
  useEffect(() => {
    if (id) {
      LinkAPI.get(id, ['type', 'email'])
        .then((res) => {
          if (res.type === PASSWORD_RECOVERY) {
            setLinkEmail(res.email)
            setChecking(false)
          } else {
            ErrorNotification('Wrong link')
          }
        })
        .catch((err) => ErrorNotification(errors.internal, err))
    }
  }, [id])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = async (values: {
    email: string
    password: string
    passwordConfirmation: string
  }): Promise<void> => {
    setLoading(true)

    try {
      if (values.email !== linkEmail) throw new Error('Incorrect data')

      await LinkAPI.process(id, {
        email: values.email,
        password: values.password
      })

      router.push('/login')
    } catch (err) {
      setLoading(false)
      ErrorNotification(errors.internal, err)
    }
  }

  /**
   * Render
   */
  if (checking)
    return (
      <Layout>
        <Card bordered={false} className="Signup">
          <Spin /> Loading...
        </Card>
      </Layout>
    )
  return (
    <Layout>
      <Card bordered={false} className="Signup">
        <Space direction="vertical" size="large" className="full-width">
          <div>
            <Typography.Title
              level={1}
              style={{ padding: 0, marginBottom: 16, fontWeight: 500 }}
            >
              Password recovery
            </Typography.Title>
          </div>
          <Form requiredMark="optional" onFinish={onFinish} layout="vertical">
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
              <Input.Password placeholder="Password" />
            </Form.Item>
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

export default PasswordRecovery
