import { useState } from 'react'
import { Button, Form, Input, Typography } from 'antd'

import Dialog from '@/components/assets/dialog'
import {
  Success as SuccessNotification,
  Error as ErrorNotification
} from '@/components/assets/notification'

import EmailAPI from '@/api/email'

/**
 * Errors (password)
 * @memberof Components.Login
 */
const errors = {
  recover: 'Unable to recover password'
}

/**
 * Password recover
 * @memberof Components.Login
 */
const PasswordRecover = (): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * Password recover
   * @param value Value
   */
  const passwordRecover = async (value: { email: string }): Promise<void> => {
    setLoading(true)

    try {
      await EmailAPI.recover(value.email)

      setLoading(false)
      setVisible(false)

      SuccessNotification(
        'An email has been send to recover your password',
        'If you entered a valid email'
      )
    } catch (err) {
      setLoading(false)
      ErrorNotification(errors.recover, err)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Forgot your password ?"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={passwordRecover}
        loading={loading}
      >
        <Form.Item
          name="email"
          label="Your email address"
          rules={[{ required: true, message: 'Please enter your email' }]}
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

export default PasswordRecover
