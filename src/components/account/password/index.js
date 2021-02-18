import { useState } from 'react'
import { notification, Button, Form, Input, Space, Card, Row, Col } from 'antd'

import { PasswordItem } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Errors account/password
 * @memeberof module:'src/components/account
 */
const errors = {
  updateError: 'Unable to update the password',
  passwordMismatch: 'Password and confirmation mismatch',
  invalid: 'Current password not valid'
}

/**
 * Password
 * @memeberof module:'src/components/account
 */
const Password = () => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const [user] = UserAPI.useUser()

  // Layout
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 8, span: 16 }
  }

  /**
   * On finish
   * @param {Object} data Data
   */
  const onFinish = async (data) => {
    setLoading(true)

    try {
      // Check current password
      const current = await UserAPI.check({
        username: user.email,
        password: data.password
      })

      if (current.valid) {
        // Change password
        await UserAPI.update([
          {
            type: 'crypt',
            key: 'password',
            value: data.newPassword
          }
        ])
      } else {
        notification.error({ message: errors.invalid })
      }
    } catch (err) {
      Error(errors.updateError, err)
    } finally {
      setLoading(false)
    }
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
            <Form.Item
              label="Current password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please enter your current password'
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <PasswordItem name="newPassword" label="New password" />
            <Form.Item
              label="Password confirmation"
              name="passwordConfirm"
              rules={[
                {
                  required: true,
                  message: 'Please enter your new password confirmation'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('newPassword') === value) {
                      return Promise.resolve()
                    }

                    return Promise.reject(errors.passwordMismatch)
                  }
                })
              ]}
            >
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
