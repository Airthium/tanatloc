/** @module Components.Login.Password */

import { useState } from 'react'
import { Button, Form, Input, Typography } from 'antd'

import Dialog from '@/components/assets/dialog'
import {
  SuccessNotification,
  ErrorNotification
} from '@/components/assets/notification'

import EmailAPI from '@/api/email'

/**
 * Errors
 */
export const errors = {
  recover: 'Unable to recover password'
}

/**
 * Password recover
 * @param value Value
 */
export const passwordRecover = async (value: {
  email: string
}): Promise<void> => {
  try {
    await EmailAPI.recover(value.email)

    SuccessNotification(
      'An email has been send to recover your password',
      'If you entered a valid email'
    )
  } catch (err) {
    ErrorNotification(errors.recover, err)
    throw err
  }
}

/**
 * Password recover
 * @returns PasswordRecover
 */
const PasswordRecover = (): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Forgot your password ?"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            await passwordRecover(values)

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
        loading={loading}
      >
        <Form.Item
          name="email"
          label="Your email address"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input placeholder="Email address" autoComplete="email" />
        </Form.Item>
      </Dialog>
      <Typography.Text>
        <Button type="link" onClick={() => setVisible(true)}>
          Forgot your password ?
        </Button>
      </Typography.Text>
    </>
  )
}

PasswordRecover.propTypes = {}

export default PasswordRecover
