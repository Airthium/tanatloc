import PropTypes from 'prop-types'
import { useState } from 'react'
import { notification, Button, Card, Form, Input, Space } from 'antd'

import { IUserWithData } from '@/lib/index.d'

import { PasswordItem } from '@/components/assets/input'
import {
  Success as SuccessNotification,
  Error as ErrorNotification
} from '@/components/assets/notification'

import UserAPI from '@/api/user'

export interface IProps {
  user: IUserWithData
}

/**
 * Errors (password)
 * @memberof Components.Account
 */
const errors = {
  update: 'Unable to update the password',
  passwordMismatch: 'Password and confirmation mismatch',
  invalid: 'Current password not valid'
}

/**
 * Password
 * @memberof Components.Account
 * @param props Props
 */
const Password = ({ user }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  // Layout
  const inputLayout = {
    labelCol: { offset: 4 },
    wrapperCol: { offset: 4, span: 16 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 4 }
  }

  /**
   * On finish
   * @param data Data
   */
  const onFinish = async (data: {
    password: string
    newPassword: string
  }): Promise<void> => {
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

        SuccessNotification('Your password has been changed successefully')
      } else {
        notification.error({ message: errors.invalid })
      }
    } catch (err) {
      ErrorNotification(errors.update, err)
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
        layout="vertical"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          password: '******',
          newPassword: '******',
          passwordConfirm: '******'
        }}
        onFinish={onFinish}
        name="passwordForm"
      >
        <Form.Item
          {...inputLayout}
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
        <PasswordItem
          {...inputLayout}
          name="newPassword"
          label="New password"
        />
        <Form.Item
          {...inputLayout}
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
  user: PropTypes.exact({
    email: PropTypes.string.isRequired
  }).isRequired
}

export default Password
