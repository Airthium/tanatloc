import PropTypes from 'prop-types'
import { useState } from 'react'
import { notification, Button, Card, Form, Input, Space } from 'antd'

import { PasswordItem } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Errors account/password
 * @memberof module:components/account
 */
const errors = {
  updateError: 'Unable to update the password',
  passwordMismatch: 'Password and confirmation mismatch',
  invalid: 'Current password not valid'
}

/**
 * Password
 * @memberof module:components/account
 * @param {Object} props Props
 */
const Password = ({ user }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Layout
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 8, span: 8 }
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
        email: user.email,
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
        <Form.Item {...buttonLayout}>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Modify password
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  )
}

Password.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired
  }).isRequired
}

export default Password
