/** @module Components.Account.Password */

import { useCallback, useState } from 'react'
import { Button, Card, Form, Input, Space } from 'antd'

import { PasswordItem } from '@/components/assets/input'
import {
  SuccessNotification,
  FormError
} from '@/components/assets/notification'

import { IFrontUser } from '@/api/index.d'
import { APIError } from '@/api/error'
import UserAPI from '@/api/user'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'email'>
}

/**
 * Errors
 */
export const errors = {
  check: 'Unable to check password',
  update: 'Unable to update password',
  passwordMismatch: 'Password and confirmation mismatch',
  invalid: 'Current password is not valid'
}

/**
 * On finish
 * @param user User
 * @param values Values
 */
export const _onFinish = async (
  user: Pick<IFrontUser, 'email'>,
  values: {
    password: string
    newPassword: string
  }
): Promise<void> => {
  let current: { valid: boolean }
  try {
    // Check current password
    current = await UserAPI.check({
      email: user.email,
      password: values.password
    })
  } catch (err) {
    throw new APIError({ title: errors.check, err })
  }

  if (!current.valid) throw new APIError({ title: errors.invalid })

  try {
    // Change password
    await UserAPI.update([
      {
        type: 'crypt',
        key: 'password',
        value: values.newPassword
      }
    ])

    SuccessNotification('Your password has been changed successfully')
  } catch (err) {
    throw new APIError({ title: errors.update, err })
  }
}

/**
 * Password
 * @param props Props
 * @returns Password
 */
const Password = ({ user }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<APIError | null>()

  // Layout
  const layout = {
    labelCol: { offset: 2 },
    wrapperCol: { offset: 2 }
  }

  /**
   * On finish
   * @param values Values
   */
  const onFinish = useCallback(
    async (values: {
      password: string
      newPassword: string
    }): Promise<void> => {
      setLoading(true)
      try {
        await _onFinish(user, values)
        setFormError(null)
      } catch (err: any) {
        setFormError(err)
      } finally {
        setLoading(false)
      }
    },
    [user]
  )

  /**
   * Render
   */
  return (
    <Card title="Your Password">
      <Form
        {...layout}
        style={{ maxWidth: 500 }}
        layout="vertical"
        onFinish={onFinish}
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
        >
          <Input.Password placeholder="Current password" />
        </Form.Item>
        <PasswordItem
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
        >
          <Input.Password placeholder="Confirm your new password" />
        </Form.Item>
        <FormError error={formError} />
        <Form.Item>
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

export default Password
