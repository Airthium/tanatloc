import { useState } from 'react'
import { message, Button, Form, Input, Space } from 'antd'

import { useUser, update, check } from '../../../../src/api/user'

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
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 14, span: 6 }
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
        update([
          {
            type: 'crypt',
            key: 'password',
            value: data.newPassword
          }
        ])
      } else {
        message.error('Password and confirmation mismatch')
      }
    } else {
      message.error('Current password not valid')
    }

    setLoading(false)
  }

  /**
   * Render
   */
  return (
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
      <Form.Item {...buttonLayout} style={{ textAlign: 'right' }}>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            Modify password
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Password
