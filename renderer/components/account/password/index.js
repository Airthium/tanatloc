import { useState } from 'react'
import { message, Button, Form, Input, Space, Card, Row, Col } from 'antd'

import { useUser, update, check } from '../../../../src/api/user'

import Sentry from '../../../../src/lib/sentry'

/**
 * Errors
 */
const errors = {
  mismatch: 'Password and confirmation mismatch',
  invalid: 'Current password not valid'
}

/**
 * Password
 * @memeberof module:renderer/components/account
 */
const Password = () => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const [user] = useUser()

  // Layout
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 5, span: 8 }
  }

  /**
   * On finish
   * @param {Object} data Data
   */
  const onFinish = async (data) => {
    setLoading(true)

    // Check current password
    const current = await check({
      username: user.email,
      password: data.password
    })

    if (current.valid) {
      // Change password
      if (data.newPassword === data.passwordConfirm) {
        try {
          await update([
            {
              type: 'crypt',
              key: 'password',
              value: data.newPassword
            }
          ])
        } catch (err) {
          message.error(err.message)
          console.error(err)
          Sentry.captureException(err)
        }
      } else {
        message.error(errors.mismatch)
      }
    } else {
      message.error(errors.invalid)
    }

    setLoading(false)
  }

  /**
   * Render
   */
  return (
    <Card title="Your Password">
      <Row>
        <Col span={4}></Col>
        <Col span={20}>
          <Form
            {...layout}
            initialValues={{
              password: '******',
              newPassword: '******',
              passwordConfirm: '******'
            }}
            onFinish={onFinish}
            name="passwordForm"
          >
            <Form.Item label="Current password" name="password">
              <Input.Password />
            </Form.Item>
            <Form.Item label="New password" name="newPassword">
              <Input.Password />
            </Form.Item>
            <Form.Item label="Password confirmation" name="passwordConfirm">
              <Input.Password />
            </Form.Item>
            <Form.Item {...buttonLayout} style={{ marginBottom: 'unset' }}>
              <Space>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Modify password
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Card>
  )
}

export default Password
