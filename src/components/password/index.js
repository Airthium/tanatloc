/** @module components/password */

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

const errors = {
  internal: 'Internal error, please try again later',
  passwordMismatch: 'Passwords mismatch'
}

const PasswordRecovery = () => {
  const [checking, setChecking] = useState(true)
  const [linkEmail, setLinkEmail] = useState()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { id } = router.query

  // Check link type
  useEffect(() => {
    if (id) {
      LinkAPI.get(id, ['type', 'email'])
        .then((res) => {
          if (res.type === PASSWORD_RECOVERY) {
            setLinkEmail(res.email)
            setChecking(false)
          }
        })
        .catch((err) => console.log(err))
    }
  }, [id])

  const onFinish = (values) => {
    setLoading(true)

    console.log(values)

    try {
      if (values.email !== linkEmail) throw new Error('Incorrect data')

      LinkAPI.process(id, {
        email: values.email,
        password: values.password
      })
      // TODO update user
      // TODO delete link

      router.push('/login')
    } catch (err) {
      setLoading(false)
      ErrorNotification(errors.internal, err)
    }
  }

  if (checking)
    return (
      <Layout>
        <Card bordered={false} className="Signup">
          <Spin /> Loading
        </Card>
      </Layout>
    )

  return (
    <Layout>
      <Card bordered={false} className="Signup">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
