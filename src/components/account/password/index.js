import { useState } from 'react'
import { notification, Button, Form, Input, Space, Card, Row, Col } from 'antd'

import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'
import SystemAPI from '@/api/system'

/**
 * Errors account/password
 * @memeberof module:'src/components/account
 */
const errors = {
  updateError: 'Unable to update the password',
  passwordTooSmall: 'Your password is too small',
  passwordTooLong: 'Your password is too long',
  passwordRequireLetter: 'Your password must contain a letter',
  passwordRequireNumber: 'Your password must contain a number',
  passwordRequireSymbol: 'Your password must contain a symbol',
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
  const [system] = SystemAPI.useSystem()

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
            <Form.Item
              label="New password"
              name="newPassword"
              rules={[
                { required: true, message: 'Please enter your new password' },
                {
                  min: system?.password?.min || 6,
                  message: errors.passwordTooSmall
                },
                {
                  max: system?.password?.max || 16,
                  message: errors.passwordTooLong
                },
                {
                  pattern: system?.password?.requireLetter && /^(?=.*[a-zA-Z])/,
                  message: errors.passwordRequireLetter
                },
                {
                  pattern: system?.password?.requireNumber && /^(?=.*[0-9])/,
                  message: errors.passwordRequireNumber
                },
                {
                  pattern:
                    system?.password?.requireSymbol &&
                    /[!@#$%^&*(){}[\]<>?/|.:;_-]/,
                  message: errors.passwordRequireSymbol
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
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
