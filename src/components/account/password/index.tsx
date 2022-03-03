/** @module Components.Account.Password */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Button, Card, Form, Input, Space } from 'antd'

import { IUserWithData } from '@/lib/index.d'

import { PasswordItem } from '@/components/assets/input'
import {
  SuccessNotification,
  FormError
} from '@/components/assets/notification'

import { APIError } from '@/api/error'
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
  check: 'Unable to check the password',
  update: 'Unable to update the password',
  passwordMismatch: 'Password and confirmation mismatch',
  invalid: 'Current password not valid'
}

/**
 * On finish
 * @param user User
 * @param values Values
 */
export const onFinish = async (
  user: IUserWithData,
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
    throw new APIError(errors.check, err)
  }

  if (!current.valid) throw new APIError(errors.invalid)

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
    throw new APIError(errors.update, err)
  }
}

/**
 * Password
 * @param props Props
 * @returns Password
 */
const Password = ({ user }: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [formError, setFormError]: [
    APIError,
    Dispatch<SetStateAction<APIError>>
  ] = useState()

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
        className="max-width-500"
        layout="vertical"
        onFinish={async (values) => {
          setLoading(true)
          try {
            await onFinish(user, values)
            setFormError(null)
          } catch (err) {
            setFormError(err)
          } finally {
            setLoading(false)
          }
        }}
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

Password.propTypes = {
  user: PropTypes.exact({
    email: PropTypes.string.isRequired
  }).isRequired
}

export default Password
