/** @module Components.Account.Password */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { notification, Button, Card, Form, Input, Space } from 'antd'

import { IUserWithData } from '@/lib/index.d'

import { PasswordItem } from '@/components/assets/input'
import {
  Success as SuccessNotification,
  Error as ErrorNotification
} from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Props
 */
export interface IProps {
  user: IUserWithData
}

/**
 * Errors
 */
const errors = {
  update: 'Unable to update the password',
  passwordMismatch: 'Password and confirmation mismatch',
  invalid: 'Current password not valid'
}

/**
 * On finish
 * @param user User
 * @param values Values
 * @param setLoading Set loading
 */
export const onFinish = async (
  user: IUserWithData,
  values: {
    password: string
    newPassword: string
  },
  setLoading: Dispatch<SetStateAction<boolean>>
): Promise<void> => {
  setLoading(true)

  try {
    // Check current password
    const current = await UserAPI.check({
      email: user.email,
      password: values.password
    })

    if (current.valid) {
      // Change password
      await UserAPI.update([
        {
          type: 'crypt',
          key: 'password',
          value: values.newPassword
        }
      ])

      SuccessNotification('Your password has been changed successfully')
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
 * Password
 * @param props Props
 * @returns Ppassword
 */
const Password = ({ user }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  // Layout
  const layout = {
    labelCol: { offset: 2 },
    wrapperCol: { offset: 2 }
  }

  /**
   * Render
   */
  return (
    <Card title="Your Password">
      <Form
        {...layout}
        layout="vertical"
        onFinish={async (values) => onFinish(user, values, setLoading)}
        name="passwordForm"
      >
        <Form.Item
          label="Current password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Current password is required'
            }
          ]}
          className="max-width-500"
        >
          <Input.Password placeholder="Current password" />
        </Form.Item>
        <PasswordItem
          className="max-width-500"
          name="newPassword"
          label="New password"
          inputPlaceholder="Enter a new password"
          required={true}
        />
        <Form.Item
          label="Password confirmation"
          name="passwordConfirm"
          rules={[
            {
              required: true,
              message: 'Password confirmation is required'
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
          className="max-width-500"
        >
          <Input.Password placeholder="Confirm your new password" />
        </Form.Item>
        <Form.Item className="max-width-500">
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
