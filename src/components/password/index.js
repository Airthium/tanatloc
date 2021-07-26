/** @module components/password */

import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Card, Form, Input, Layout, Space, Typography } from 'antd'

import { PasswordItem } from '@/components/assets/input'

const errors = {
  internal: 'Internal error, please try again later',
  passwordMismatch: 'Passwords mismatch'
}

const PasswordRecovery = () => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { id } = router.query
  console.log(id)
  //TODO check id in links

  const onFinish = (values) => {
    setLoading(true)

    try {
      // TODO api call
      router.push('/login')
    } catch (err) {
      setLoading(false)
      ErrorNotification(errors.internal, err)
    }
  }

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
